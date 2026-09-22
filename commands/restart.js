"use strict";

const fs = require("fs");
const path = require("path");

const restartFile = path.join(process.cwd(), "restart.json");

module.exports = {
  config: {
    name: "restart",
    aliases: ["rs"],
    author: "ChatGPT",
    category: "admin",
    role: 2,
    cooldown: 5,
    description: {
      en: "Restart the bot"
    }
  },

  onLoad: async ({ api }) => {
    try {
      if (!fs.existsSync(restartFile)) return;

      const data = JSON.parse(fs.readFileSync(restartFile, "utf8"));
      fs.unlinkSync(restartFile);

      const time = ((Date.now() - data.time) / 1000).toFixed(1);

      api.sendMessage(
        `✅ Restart Done\n⏱️ ${time}s`,
        data.threadID
      );
    } catch {}
  },

  onStart: async ({ message, event }) => {
    fs.writeFileSync(
      restartFile,
      JSON.stringify({
        threadID: event.threadID,
        time: Date.now()
      })
    );

    await message.reply("🔄 Restarting...");

    setTimeout(() => {
      process.kill(process.pid, "SIGTERM");
    }, 500);
  }
};