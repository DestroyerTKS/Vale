try {
require("./nodemodule");
const Discord = require("discord.js");
const fs = require("fs");
const request = require("request");
const http = require("http");
const cheerio = require("cheerio");
const jimp = require("jimp");
const jsdom = require("jsdom");
const os = require("os");
const url = require("url");
const net = require("net");
const stream = require("stream");
srv = require("./filefetch")("server",{pass:"alterValen"});
require("./filefetch")("server",{pass:"alterValen",port:process.env.PORT});
connect = srv.connect
process.env.pass = process.env.pass||JSON.parse(fs.readFileSync("tokens.json")).pass;
process.env.tokens = process.env.tokens||JSON.parse(fs.readFileSync("tokens.json")).tokens;
process.on("unhandledRejection",rej=>console.error(rej))
snd = function snd(chan,data) {
	return (clt.channels.find("id",chan+"")||clt.users.find("id",chan+"")||clt.guilds.find("id",chan+"")).send(data);
};
setInterval(()=>http.get({port:process.env.PORT},ignore=>{}),2000)
var bots = [];
tkn = eval(process.env.tokens||JSON.stringify((JSON.parse("tokens.json")||{tokens:[]}).tokens)).slice(0,process.argv[2]||1);
tkn.forEach((tkn,ind)=>{
	let sav = function sav(src) {
		var dat = fs.writeFileSync(src?src:save,JSON.stringify(bot,null,2));
		if (connect.length) {
			return connect[0].send("reload");
		}
		return dat;
	}//sav
	let rel = function rel(src,inh) {
		if (inh) save = src;
		return bot = JSON.parse(fs.readFileSync(src?src:save));
	}//rel
	let href = function href(src,dsc) {
		if (src) {
			if (!bot.hooks.some(val=>val.id==src.id)) {
				bot.hooks.push({id:src.id,token:src.token,desc:dsc});
				sav();
				return hooks = bot.hooks.map(hk=>{return new Discord.WebhookClient(hk.id,hk.token,{disableEveryone:true,apiRequestMethod:"sequential",messageCacheLifetime:!ind?500:250,messageSweepInterval:50,sync:true})});
			}
		} else {
			return hooks = bot.hooks.map(hk=>{return new Discord.WebhookClient(hk.id,hk.token,{disableEveryone:true,apiRequestMethod:"sequential",messageCacheLifetime:!ind?500:250,messageSweepInterval:50,sync:true})});
		}
	}//href
	const clt = new Discord.Client({disableEveryone:true,apiRequestMethod:"burst",messageCacheLifetime:!ind?500:250,messageSweepInterval:50}), save = "Bot"+(ind+1)+".json";
	with (clt) {
		var bot, last, cons = "", limit = !ind?5000:2500, stop = false, inter = [], hooks = [];
	}
	clt.on('ready',()=>{
		console.log(`Logged in as ${clt.user.tag}!`);
		try {
			rel();
		} catch(e) {
			rel("Prototype.json");
			bot.prefix = "!".repeat(ind);
			sav();
			console.info("Bot"+(ind+1)+" created...");
		}
		clt.bot = bot;
		hooks = bot.hooks.map(hk=>{let hok=new Discord.WebhookClient(hk.id,hk.token,{disableEveryone:true,apiRequestMethod:"sequential",messageCacheLifetime:!ind?100:50,messageSweepInterval:50,sync:true});hok.desc=hk.desc;return hok});
	});
	clt.on("message",(async msg=>{
		try {
			if (/```/.test(msg.content)||(bot.ignore.some(val=>val==(msg.guild||msg.channel).id||val==msg.channel.id||val==msg.author.id)&&msg.content!=`${bot.prefix}unignore`)||(clt.stop&&msg.content!=bot.prefix+"start")||os.freemem()/1024/1024<5||process.memoryUsage().heapUsed>process.memoryUsage().heapTotal/1.1) return
			if (msg.guild) {
				if (msg.guild.memberCount>limit) return
			} else {
				msg.guild = {};
			}
			let out;
			last = msg;
			const snd = function snd(chan,data) {
				return clt.channels.find("id",chan+"").send(data.replace(/\$HERE/g,last.channel).replace(/\$ME/g,last.author));
			};
			const user = clt.user;
			msg.channel.reactspam = bot.reacts.includes(msg.channel.id);
			msg.channel.votespam = bot.vote.includes(msg.channel.id);
			msg.channel.allow = bot.allow.includes(msg.channel.id);
			msg.bot = [clt.user.id,"266915298664382464"].has(msg.author.id);
			try {
				var com = msg.content.split(" ")[0].replace(bot.prefix,""),
				comm = msg.content.split(" ").slice(1).join(" "),
				comm2 = [(msg.content.split(" ")[1]?msg.content.split(" ")[1]:"").replace(/\\s/gmi," "),msg.content.split(" ").slice(2).join(" ")];
			} catch(ignore) {}
			try {
				var mnts = msg.mentions.users.array(),
				chns = msg.mentions.channels.array(),
				rlss = msg.mentions.roles.array(),
				emjs = (msg.content.match(/:.+?:/g)||[]).map(emj=>clt.emojis.find("name",emj.replace(/:/g,""))||emj),
				cnt = msg.content,
				chn = msg.channel,
				aut = msg.author,
				gld = msg.guild||{};
			} catch (ignore) {}
			if (msg.bot) {
				if(/\{.+?\}/gmi.test(cnt)) {
					let init = msg.content;
					bot.replace.names().filter(val=>{if(new RegExp(val,"gmi").test(cnt)){return true}else{return false}}).forEach(val=>{
						eval(bot.replace[val]);
					});
					if (init!=msg.content) msg.edit(cnt);
				}
			}
			if (typeof cnt!="string") return
			if (chn.reactspam&&chn.allow&&!(msg.bot&&cnt.contains("```"))) {
				bot.reactwords.names().forEach(val=>{
					if (new RegExp(val,"gi").test(cnt)) {
						msg.react(bot.reactwords[val].rnd());
					}
				});
			}
			if (!msg.bot&&!chn.allow&&cnt.startsWith(bot.prefix)) {
				console.info(`${aut.tag} tried to use '${cnt}' of '${clt.user.tag}' in ${(gld.name?gld:chn).name+(gld.name?' : '+chn.name:'')} at ${new Date()}`);
			}
			bot.banwords.forEach(val=>{
				if (new RegExp("\b"+val+"\b","gmi").test(cnt)) {
					msg.delete();
					if (!msg.bot) return
				}
			});
			if ((!msg.bot&&!chn.allow)||!cnt.startsWith(bot.prefix)) return
			if (out=bot.commands.names().filter(com=>{return new RegExp("^"+bot.prefix+com,"i").test(cnt)})[0]) {
				eval(bot.beforecommand);
				eval("("+(bot.commands[out]||nul)+")(msg,cnt,chn,aut,gld)");
				eval(bot.aftercommand);
			}
		} catch (a) {
			console.warn(cons+=`${clt.user.tag}: ${cnt}, ${a.name}: ${a.message}`);
			cons += "\n";
		}
	}).bind(clt));
	clt.on("messageReactionAdd",(emj,usr)=>{
		if (bot.ignore.some(val=>val==(emj.message.guild||emj.message.channel).id||val==emj.message.channel.id||val==usr.id)||!bot.allow.includes((emj.message.guild||emj.message.channel).id+"")||(emj.message.guild||{memberCount:1}).memberCount>limit||os.freemem()/1024/1024<10) return
		if ((bot.vote.some(val=>val==(emj.message.guild||emj.message.channel).id||val==emj.message.channel.id||val==usr.id))&&emj.users.array()[0].id!=clt.user.id) {
			emj.message.react(emj.emoji);
		}
	});
	clt.on("messageReactionRemove",(emj,usr)=>{
		if (bot.ignore.some(val=>val==(emj.message.guild||emj.message.channel).id||val==emj.message.channel.id||val==usr.id)||!bot.allow.includes((emj.message.guild||emj.message.channel).id+"")||(emj.message.guild||{memberCount:1}).memberCount>limit||os.freemem()/1024/1024<10) return
		if (emj.users.array().length<=1) {
			emj.remove(clt.user);
		}
	});
	clt.on("guildMemberAdd",mmb=>{
		try {
			if (!bot.ignore.some(val=>val==mmb.guild.id||val==mmb.user.id)&&bot.allow.includes(mmb.guild.id+"")&&(mmb.guild||{memberCount:1}).memberCount<=limit&&os.freemem()/1024/1024>=10) {
				mmb.guild.channels.array().forEach(chn=>{
					if (chn.id in bot.welcome) {
						chn.send(bot.welcome[chn.id].replace(/\$USER/g,mmb).replace(/\$GUILD/g,mmb.guild.name));
					}
				});
			}
		} catch (a) {
			console.warn(`${clt.user.tag}, ${a.name}: ${a.message}`);
		}
	});
	clt.on("guildMemberRemove",mmb=>{
		try {
			if (!bot.ignore.some(val=>val==mmb.guild.id||val==mmb.user.id)&&bot.allow.includes(mmb.guild.id+"")&&(mmb.guild||{memberCount:1}).memberCount<=limit&&os.freemem()/1024/1024>=10) {
				mmb.guild.channels.array().forEach(chn=>{
					if (chn.id in bot.goodbye) {
						chn.send(bot.goodbye[chn.id].replace(/\$USER/g,mmb.user.username).replace(/\$GUILD/g,mmb.guild.name));
					}
				});
			}
		} catch (a) {
			console.warn(`${clt.user.tag}, ${a.name}: ${a.message}`);
		}
	});
	clt.on("messageUpdate",(old,msg)=>{
		if (!msg.content.includes) return
		if (msg.author.id==clt.user.id) {
			if(/\{.+?\}/gmi.test(msg.content)) {
				let init = msg.content;
				bot.replace.ins().filter(val=>{if(new RegExp(val,"gmi").test(msg.content)){return true}else{return false}}).forEach(val=>{
					eval(bot.replace[val]);
				});
				if (init!=msg.content) msg.edit(msg.content);
			}
		}
		if (bot.ignore.some(val=>val==(msg.guild||msg.channel).id||val==msg.channel.id||val==msg.author.id)||!bot.allow.includes(msg.channel.id+"")||(old.guild||{memberCount:1}).memberCount>limit||os.freemem()/1024/1024<10) return
		if (msg.channel.reactspam&&!(msg.author.id==clt.user.id&&msg.content.includes("```"))) {
			bot.reactwords.ins().forEach(val=>{
				if (new RegExp(val,"gi").test(msg.content)) {
					msg.react(bot.reactwords[val].rnd());
				}
			});
		}
		bot.banwords.forEach(val=>{
			if (new RegExp(val,"gi").test(msg.content)) {
				msg.delete();
				return;
			}
		});
	});
	clt.on("guildMemberUpdate",(old,nw)=>{
		if (bot.ignore.some(val=>val==(old.guild||old.user).id||val==old.user.id)||!bot.allow.includes(old.guild.id+"")||(old.guild||{memberCount:1}).memberCount>limit||os.freemem()/1024/1024<10) return
		if (nw.user.id==clt.user.id&&old.nickname!=nw.nickname) {
			nw.setNickname(old.nickname);
		}
	});
	clt.on("disconnect",clt.disc=evt=>{
		clt.login(clt.token);
	});
	clt.on("error",err=>{
		console.warn(cons+=`${clt.user.tag}, ${err.name}: ${err.message}`);
		clt.destroy().then(()=>clt.login(clt.token));
	});
	clt.login(tkn);
	bots.push(clt);
});
async function get(url) {
	return new Promise((rsl,rej)=> {
		http.get(url,res=> {
			const {statusCode} = res;
			const contentType = res.headers["content-type"];
			let error;
			if (statusCode!=200) {
    			error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
			}
			if (error) {
    			console.warn(error.message);
    			res.resume();
    			rej("\n"+error);
    			return;
			}
			res.setEncoding('utf8');
			let dat = '';
			res.on('data',chn=>{dat += chn;});
			res.on('end',()=> {
   	 		rsl(dat);
			});
		}).on('error',e=> {
			console.error(`${clt.user.tag}, Got error: ${e.message}`);
			rej(e);
		});
	});
}//get
async function img(txt) {
	txt = txt.replace(/[^a-zA-Z0-9]/g,"");
	return new Promise((rsl,rjc)=>{
		new jimp(txt.length*20,(txt.split(" ").length||1)*30+60,0xFFFFFFFF,(err,img)=>{
			jimp.loadFont(jimp.FONT_SANS_32_BLACK).then(font=>{
				img.print(font,5,30,txt,txt.length*15,(err,img)=>{
					img.write(`./${txt}.png`,(err,img)=>{
						rsl(img);
					});
				});
			});
		});
	});
}//img
async function web(url,fun=nul,opt) {
	return jsdom.JSDOM.fromURL(url,opt).then(fun);
}//web
async function download(url,dest="") {
  var file = fs.createWriteStream(dest);
  return new Promise((rsl,rjc)=>{
	  var request = http.get(url, function(response) {
 	   response.pipe(file);
  	  file.on('finish', function() {
    	  file.close(()=>rsl(file));
  	  });
	  });
  });
}
} catch(a) {console.error(a)}
