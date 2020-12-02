const Discord = require('discord.js');
const client = new Discord.Client();
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();
const prefix = '!';

const fs = require('fs');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

for(const file of commandFiles) {
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Dredaybot is Online')
});

client.on('guildMemberAdd', guildMember => {
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'member');
    guildMember.roles.add(welcomeRole);
    guildMember.guild.channels.cache.get('783773051987951626').send(`Welcome <@${guildMember.user.id} to our server! Check out the Rules`)
});

client.on('message',message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return
    currency.add(message.author.id, 1);
    
	const input = message.content.slice(prefix.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
    const args = message.content.slice(prefix.length).split(/ +/);

    if (command === 'ping') {
        client.commands.get('ping').execute(message,args);
    } else if(command === 'youtube') {
        client.commands.get('aboutme').execute(message,args);
    } else if(command === 'youtube') {
        client.commands.get('mute').execute(message,args);
    } else if(command === 'poll') {
        client.commands.get('poll').execute(message,args);
    } else if (command === 'balance') {
		const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	} else if (command === 'leaderboard') {
		return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                .filter(user => client.users.cache.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
                .join('\n'),
            { code: true }
        );
	}
});



client.login('NzQyOTI3MDk1Nzk3MTIxMDM0.XzNOxg.D3WEQv4_CS7D90Nq9TT9WMcTMy0')