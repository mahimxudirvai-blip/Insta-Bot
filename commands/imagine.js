"use strict";

const axios = require("axios");

async function getBaseURL() {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
}

module.exports = {
  config: {
    name: "imagine",
    aliases: ["img"],
    author: "Ariyan",
    category: "ai",
    cooldown: 10,
    role: 0,
    description: { en: "Generate AI image" }
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("Please enter a prompt.");

    try {
      const base = await getBaseURL();
      const url = `${base}/imagine?prompt=${encodeURIComponent(prompt)}`;

      const res = await axios.get(url, {
        responseType: "stream"
      });

      await message.reply({
        body: `✨ | ${prompt}`,
        attachment: res.data
      });
    } catch (e) {
      console.log(e);
      message.reply("Failed to generate image.");
    }
  }
};