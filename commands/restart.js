"use strict";

const fs = require("fs");
const path = require("path");

const restartFile = path.join(__dirname, "restart.json");

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

	// Runs automatically when the bot starts
	onLoad: async function ({ api }) {
		try {
			if (!fs.existsSync(restartFile)) return;

			const data = JSON.parse(fs.readFileSync(restartFile, "utf8"));
			fs.unlinkSync(restartFile);

			const seconds = ((Date.now() - data.time) / 1000).toFixed(1);

			api.sendMessage(
				`✅ Restart Done!\n⏱️ Time: ${seconds}s`,
				data.threadID
			);
		} catch (e) {
			console.error("Restart notify error:", e);
		}
	},

	onStart: async function ({ message, event }) {
		fs.writeFileSync(
			restartFile,
			JSON.stringify({
				threadID: event.threadID,
				time: Date.now()
			})
		);

		await message.reply("🔄 | Restarting bot...");

		setTimeout(() => process.exit(0), 1000);
	}
};