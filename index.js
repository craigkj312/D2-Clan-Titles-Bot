const Discord = require('discord.js');
const client = new Discord.Client();

import { getClanMembers } from './utils/api';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!titles') {

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
            Promise.all(memberMap)
            .then(response => {
                this.setState({isLoading: false, raidCounts: response})
            })






        })


        

        msg.reply('pong');
    }
});

client.login(process.env.DISCORD_CLIENT);