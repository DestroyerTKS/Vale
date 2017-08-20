﻿const Discord = require("discord.js");
const clt = new Discord.Client();
clt.on('ready',()=>{
	console.log(`Logged in as ${clt.user.tag}!`);
});
clt.on("message",msg=>{
	if (/#5509$/.test(clt.user.tag)) {
		if (msg.content=="ping") {
			msg.reply("Pong! "+clt.ping);
		} else if (msg.content=="kill") {
			msg.reply("*Bot shutdown...*").then(clt.user.destroy).then(process.exit).catch(process.exit);
		} else if (/^!!sd /gmi.test(msg.content)) {
			msg.reply(msg.content.replace(/^!!sd /gmi,"")).then(msg=>setTimeout(msg=>msg.delete(),2500,msg));
			msg.delete();
		} else if (/^eval /i.test(msg.content)) {
			eval(msg.content.replace(/^eval /i,""));
		}
	}
	if (/gay/gi.test(msg.content)) {
		msg.react("gay_pride_flag").catch(()=>msg.react(":gay_pride_flag:"));
	}
});
clt.on("messageReactionAdd",(emj,usr)=>{
	emj.message.react(emj.emoji);
});
clt.login();