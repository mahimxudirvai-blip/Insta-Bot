"use strict";

const t = require("../src/languages").text;
const { saveConfig } = require("../src/config");

module.exports = {
	config: {
		name: "admin",
		aliases: ["adminbot"],
		author: "Neoaz 🐊",
		category: "admin",
		cooldown: 2,
		role: 2,
		noPrefix: true,
		description: { en: "Add, remove or list bot admins" },
		usage: { en: "{p}admin add|remove|list [userID]" }
	},

	onStart: async function ({ message, args, event, config, api }) {
		const lang = config.language;
		const action = (args.shift() || "list").toLowerCase();

		let target = args[0];
		if (!target && event.messageReply?.senderID)
			target = String(event.messageReply.senderID);

		// LIST ADMINS
		if (action === "list") {
			if (!config.adminBot.length)
				return message.reply("Bot admins:\n—");

			const result = [];

			for (const uid of config.adminBot) {
				try {
					const info = await api.getUserInfo(uid);
					const user = info[uid] || {};

					if (user.username)
						result.push(`• @${user.username}`);
					else if (user.name)
						result.push(`• ${user.name}`);
					else
						result.push(`• ${uid}`);
				} catch {
					result.push(`• ${uid}`);
				}
			}

			return message.reply(`Bot admins:\n${result.join("\n")}`);
		}

		// CHECK UID
		if (!target || !/^\d+$/.test(target))
			return message.reply(
				"Provide a numeric Instagram user ID or reply to a user's message."
			);

		// ADD ADMIN
		if (action === "add") {
			if (config.adminBot.includes(target))
				return message.reply("This user is already a bot admin.");

			config.adminBot.push(target);
			saveConfig(config);

			return message.reply(`✅ Added bot admin:\n${target}`);
		}

		// REMOVE ADMIN
		if (action === "remove") {
			if (!config.adminBot.includes(target))
				return message.reply("This user is not a bot admin.");

			config.adminBot = config.adminBot.filter(id => id !== target);
			saveConfig(config);

			return message.reply(`✅ Removed bot admin:\n${target}`);
		}

		return message.reply("Usage: admin add|remove|list [userID]");
	}
};