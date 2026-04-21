const { EventEmitter } = require("events");
const { exec } = require("child_process");
const path = require("path");
const simpleGit = require("simple-git");

const IDE_PROCESSES = ["code", "cursor", "code-insiders", "idea", "webstorm", "nvim", "vim"];

function execAsync(command) {
  return new Promise((resolve) => {
    exec(command, (error, stdout) => {
      if (error) {
        resolve("");
        return;
      }

      resolve(stdout.trim());
    });
  });
}

class ActivityMonitor extends EventEmitter {
  constructor(options = {}) {
    super();
    this.workspacePath = options.workspacePath || process.cwd();
    this.projectName = options.projectName || path.basename(this.workspacePath);
    this.ideProcesses = options.ideProcesses || IDE_PROCESSES;
    this.intervalMs = options.intervalMs || 60000;
    this.git = simpleGit({ baseDir: this.workspacePath });
    this.lastCommitHash = null;
    this.timer = null;
  }

  async init() {
    try {
      const log = await this.git.log({ maxCount: 1 });
      this.lastCommitHash = log.latest ? log.latest.hash : null;
    } catch {
      this.lastCommitHash = null;
    }
  }

  async detectIDEActivity() {
    const raw = await execAsync("ps -A -o comm=");
    if (!raw) {
      return false;
    }

    const processes = raw
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .filter(Boolean);

    return this.ideProcesses.some((name) => processes.some((proc) => proc.includes(name)));
  }

  async collectCommitDelta() {
    try {
      const log = await this.git.log({ maxCount: 20 });
      if (!log.latest) {
        return 0;
      }

      if (!this.lastCommitHash) {
        this.lastCommitHash = log.latest.hash;
        return 0;
      }

      if (log.latest.hash === this.lastCommitHash) {
        return 0;
      }

      const commitsSince = log.all.findIndex((commit) => commit.hash === this.lastCommitHash);
      this.lastCommitHash = log.latest.hash;

      if (commitsSince === -1) {
        return 1;
      }

      return Math.max(1, commitsSince);
    } catch {
      return 0;
    }
  }

  async collectModifiedFilesCount() {
    try {
      const status = await this.git.status();
      return (
        status.modified.length +
        status.not_added.length +
        status.created.length +
        status.renamed.length +
        status.staged.length
      );
    } catch {
      return 0;
    }
  }

  async sample() {
    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - this.intervalMs);

    const [ideActive, commitCount, modifiedFiles] = await Promise.all([
      this.detectIDEActivity(),
      this.collectCommitDelta(),
      this.collectModifiedFilesCount()
    ]);

    const durationMinutes = ideActive ? Math.round(this.intervalMs / 60000) : 0;
    const keystrokesEstimate = ideActive ? Math.max(12, modifiedFiles * 28) : 0;

    const payload = {
      type: "activity",
      project: this.projectName,
      source: "desktop-agent",
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      keystrokes: keystrokesEstimate,
      commitCount,
      notes: `ideActive=${ideActive};modifiedFiles=${modifiedFiles}`
    };

    this.emit("activity", payload);
  }

  async start() {
    await this.init();

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      void this.sample();
    }, this.intervalMs);

    await this.sample();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

module.exports = ActivityMonitor;
