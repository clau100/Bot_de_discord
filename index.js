const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits, REST} = require('discord.js');
const { token } = require('./config');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,],
    // Guilds to have access to channels, messages to handle message creation, deletion, messagecontent to get the deleted messages
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) { // initialize the commands
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => { // check when the bot is deployed
    console.log('Ready!');

});

const rest = new REST({ version: '10' }).setToken(token);

client.on(Events.InteractionCreate, async interaction => { // check if an interaction happened and handle the command
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.exec(interaction, client, rest);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

let stdin = process.openStdin();
stdin.addListener("data", (d) => { // send messages to test_channel from the bot
    let test_channel = "705387118289092718"
    let readLine = d.toString().trim();
    if (readLine !== "") client.channels.resolve(test_channel).send(readLine);
});

let dump_channel = "1042520333128830998";

client.on("messageDelete", (message) => { // sends ALL deleted message to dump_channel
    console.log("Deleted a message!!!");
    client.channels.resolve(dump_channel).send(`${message.author} deleted : ${message.content}\n in channel: ${message.channel}`);
});

client.on("messageUpdate", (oldMessage, newMessage) =>{ // sends edited messages to dump_channel
    if (oldMessage.content === newMessage.content) return;
    console.log("Edited a message!!!");
    client.channels.resolve(dump_channel).send(`${oldMessage.author} edited : ${oldMessage.content}\n in channel: ${oldMessage.channel}`);
})

process.on('SIGINT', async () => { // when ctrl+c kill the processes before killing the app
    console.log("Caught interrupt signal");
    await client.destroy();
    process.exit();
});

client.login(token);
