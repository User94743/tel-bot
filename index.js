const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '5469386732:AAFee_TLtjse4UY4Ws8oXmsEpCpHd05AWX0'

const bot = new TelegramBot(token, {polling: true});

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Угадай число от 0 до 9');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'START'},
        {command: '/info', description: 'INFO'},
        {command: '/game', description: 'GAME'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, 'Привет!');
        }
        if (text === '/game') {
           return startGame(chatId)
        }

        if (text === '/info') {
            await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name } ${msg.from.last_name}`);
            return bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/192/11.webp')
        }
            return bot.sendMessage(chatId, `I don't understand`);

    })

    bot.on('callback_query', async msg => {
                const data = msg.data;
                const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }
        console.log(chats[chatId])
        console.log(data)
                if (data === String(chats[chatId])) {
                   await bot.sendMessage(chatId,`You win: ${chats[chatId]}`, againOptions);
                } else {
                   await bot.sendMessage(chatId,`You lose, try again ${chats[chatId]}`, againOptions);
                }

    })
}

start()