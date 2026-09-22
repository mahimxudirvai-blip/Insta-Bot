"use strict";

const fs = require("fs-extra");

module.exports = {
	config: {
		name: "restart",
		version: "1.1",
		author: "NTKhang + Edit",
		countDown: 5,
		role: 2,
		description: {
			en: "Restart bot"
		},
		category: "Owner",
		guide: {
			en: "{pn}"
		}
	},

	langs: {
		en: {
			restarting: "🔄 | Restarting..."
		}
	},

	onLoad: async function ({ api }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;

		if (fs.existsSync(pathFile)) {
			const [threadID, time] = fs.readFileSync(pathFile, "utf8").split(" ");
			const seconds = ((Date.now() - Number(time)) / 1000).toFixed(1);

			api.sendMessage(
				`✅ | Restart Done\n⏱️ | Time: ${seconds}s`,
				threadID
			);

			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const dir = `${__dirname}/tmp`;
		const pathFile = `${dir}/restart.txt`;

		if (!fs.existsSync(dir))
			fs.mkdirSync(dir, { recursive: true });

		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);

		await message.reply(getLang("restarting"));

		process.exit(2);
	}
};