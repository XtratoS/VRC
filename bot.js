const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const Discord = require('discord.js');
const bot = new Discord.Client();
var streams = {};
var intervals = {};
const OWNER_ID = '298518538958667786';

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  const silenceBuffer = Buffer.alloc(3840);
  bot.on('guildMemberSpeaking', (member, speaking) => {
    const {id} = member
    const newState = speaking.bitfield
    if (streams[id]) {
      if (newState === 0) {
        intervals[id] = setInterval(() => {
          if (streams[id]){
            const fileStream = streams[id].fileStream;
            fileStream.write(silenceBuffer);
          } else {
            clearInterval(intervals[id]);
          }
        }, 20);
      } else {
        intervals[id] && clearInterval(intervals[id]);
      }
    } else {
      intervals[id] && clearInterval(intervals[id]);
    }
  });
});

bot.on('message', async msg => {
  if (msg.member.id === OWNER_ID && msg.content.startsWith(';start;')) {
    const voiceChannel = msg.member.voice.channel;
    if (voiceChannel) {
      const connection = await voiceChannel.join();
      const mentionedMembers = msg.mentions.members.array().slice(0, 4);
      mentionedMembers.forEach((mentionedMember) => {
        const mentionedID = mentionedMember.id;
        if (mentionedID === bot.user.id) return;
        let audioStream;
        try {
          audioStream = connection.receiver.createStream(mentionedMember, { mode: 'pcm', end: 'manual' });
        } catch (e) {
          console.error(e);
          return msg.reply(`Recording didn't start due to a bot error: ${e.substring(0, 800)}`);
        }
        msg.channel.send(`Started recording for ${mentionedMember}`);
        audioStream.on('close', () => {
          msg.channel.send(`Stopped Recording for ${mentionedMember.displayName}`).catch((e)=>{console.log(e)});
        });
        let fileStream = fs.createWriteStream(mentionedID);
        audioStream.pipe(fileStream);
        streams[mentionedID] = {audioStream, fileStream};
      });
    }
  } else if (msg.member.id === OWNER_ID && msg.content === ';stop;') {
    for (let uid in streams) {
      streams[uid].audioStream.destroy();
      streams[uid].fileStream.destroy();
      delete streams[uid];
      let command = ffmpeg(uid).inputOptions([
        '-ar 48000',
        '-ac 2',
        '-f s16le'
      ]).output(`${uid}.wav`);
      command.run();
    }
  }
});

bot.login(process.env.VRC_BOT_TOKEN);