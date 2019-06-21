import dotenv from 'dotenv'
dotenv.config()

import Discord from 'discord.js';
const client = new Discord.Client();

import { getClanMembers } from './utils/api.mjs';
import { getRaidCount, getCrucibleWins, getGambitWins, getStrikeCount } from './utils/utils.mjs';

// const getClanMembers = require('./utils/api').getClanMembers;
// const getRaidCount = require('./utils/utils').getRaidCount;
// const getCrucibleWins = require('./utils/utils').getCrucibleWins;
// const getGambitWins = require('./utils/utils').getGambitWins;
// const getStrikeCount = require('./utils/utils').getStrikeCount;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!titles') {

        const atDate = new Date();

        getClanMembers(process.env.GROUP_ID)
        .then(response => {
            
            let memberList = response.results

            let raidMap = memberList.map((member) => {
                return getRaidCount(member.destinyUserInfo.displayName, member.destinyUserInfo.membershipId, atDate)
            })
            let pvpMap = memberList.map((member) => {
                return getCrucibleWins(member.destinyUserInfo.displayName, member.destinyUserInfo.membershipId, atDate)
            })
            let gambitMap = memberList.map((member) => {
                return getGambitWins(member.destinyUserInfo.displayName, member.destinyUserInfo.membershipId, atDate)
            })
            let strikeMap = memberList.map((member) => {
                return getStrikeCount(member.destinyUserInfo.displayName, member.destinyUserInfo.membershipId, atDate)
            })

            let promiseMaps = [raidMap, pvpMap, gambitMap, strikeMap]
            let allPromises = promiseMaps.map((promises) => {
                return Promise.all(promises)
            })

            Promise.all(allPromises)
            .then(response => {
                message.channel.send({embed: {
                    color: 3447003,
                    author: {
                      name: client.user.username,
                      icon_url: client.user.avatarURL
                    },
                    title: "This is an embed",
                    url: "http://google.com",
                    description: "This is a test embed to showcase what they look like and what they can do.",
                    fields: [{
                        name: "Fields",
                        value: "They can have different fields with small headlines."
                      },
                      {
                        name: "Masked links",
                        value: "You can put [masked links](http://google.com) inside of rich embeds."
                      },
                      {
                        name: "Markdown",
                        value: "You can put all the *usual* **__Markdown__** inside of them."
                      }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: client.user.avatarURL,
                      text: "© Example"
                    }
                  }
                });
            })
            .catch((err) => {
                console.log("Couldn't get clan stats: ", err);
                msg.reply('Failed to get clan stats.');
            });

        })
        .catch((err) => {
            console.log("Couldn't get clan info: ", err);
            msg.reply("Failed to get clan member list.");
        });


        

        
    }
});

console.log('BUNGIE_API_KEY: ', process.env.BUNGIE_API_KEY);
console.log('DISCORD_CLIENT: ', process.env.DISCORD_CLIENT);
console.log('GROUP_ID: ', process.env.GROUP_ID);

client.login(process.env.DISCORD_CLIENT);