import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai';
import { Client, IntentsBitField } from 'discord.js';

const config = new Configuration({
    apiKey: process.env.API_KEY
})

const openai = new OpenAIApi(config);

const chatbot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

chatbot.on('ready', (c) => {
    console.log(`${c.user.tag} is online..`)
})

chatbot.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.id !== process.env.CHANNEL_ID) return;
    if (msg.content.startsWith('/') || msg.content.startsWith('!')) return;

    const chatlogs = [{ role: 'system', content: 'You are a friendly chatbot.' }]

    chatlogs.push({
        role: 'user',
        content: msg.content
    })

    await msg.channel.sendTyping();

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatlogs,
    });

    console.log(msg.content, " \n", completion.data.choices[0].message.content)
    msg.reply(completion.data.choices[0].message.content)
})

chatbot.login(process.env.BOT_TOKEN)