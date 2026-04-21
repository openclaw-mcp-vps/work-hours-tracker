const { app, Menu, Tray } = require("electron");
const path = require("path");
const cron = require("node-cron");
const Redis = require("ioredis");

const ActivityMonitor = require("./activity-monitor");

const TRACKING_API_URL = process.env.TRACKING_API_URL || "http://localhost:3000/api/tracking";
const WORKSPACE_PATH = process.env.WORKSPACE_PATH || process.cwd();
const PROJECT_NAME = process.env.PROJECT_NAME || path.basename(WORKSPACE_PATH);

let tray = null;
let monitor = null;
let redis = null;
const queue = [];

function connectRedis() {
  if (!process.env.REDIS_URL) {
    return;
  }

  redis = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1
  });

  redis.connect().catch(() => {
    redis = null;
  });
}

async function enqueue(payload) {
  queue.push(payload);
  if (redis) {
    try {
      await redis.lpush("work-hours-tracker:queue", JSON.stringify(payload));
    } catch {
      redis = null;
    }
  }
}

async function flushQueue() {
  while (queue.length > 0) {
    const payload = queue[0];

    try {
      const response = await fetch(TRACKING_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        return;
      }

      queue.shift();
      if (redis) {
        await redis.rpop("work-hours-tracker:queue");
      }
    } catch {
      return;
    }
  }
}

function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: "Force Sync",
      click: () => {
        void flushQueue();
      }
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      }
    }
  ]);
}

async function startAgent() {
  connectRedis();

  monitor = new ActivityMonitor({
    workspacePath: WORKSPACE_PATH,
    projectName: PROJECT_NAME,
    intervalMs: 60000
  });

  monitor.on("activity", (payload) => {
    void enqueue(payload);
  });

  await monitor.start();

  cron.schedule("*/1 * * * *", () => {
    void flushQueue();
  });
}

app.whenReady().then(async () => {
  tray = new Tray(path.join(__dirname, "tray-icon.png"));
  tray.setToolTip("Work Hours Tracker Agent");
  tray.setContextMenu(buildMenu());

  await startAgent();
  void flushQueue();
});

app.on("window-all-closed", (event) => {
  event.preventDefault();
});

app.on("before-quit", () => {
  if (monitor) {
    monitor.stop();
  }

  if (redis) {
    redis.disconnect();
  }
});
