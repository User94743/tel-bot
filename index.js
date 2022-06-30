const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '5469386732:AAFee_TLtjse4UY4Ws8oXmsEpCpHd05AWX0';
const sequelize = require('./db');
const UserModel = require('./models');

const bot = new TelegramBot(token, {polling: true});

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Угадай число от 0 до 9');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Error :)', e)
    }
    bot.setMyCommands([
        {command: '/start', description: 'START'},
        {command: '/info', description: 'INFO'},
        {command: '/game', description: 'GAME'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await UserModel.create({chatId});
                await bot.sendMessage(chatId, 'Привет!');
                return bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/192/11.webp')
            }
            if (text === '/game') {
                return startGame(chatId)
            }

            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name } ${msg.from.last_name}
                Правильных ответов ${user.right} и не правильных ${user.wrong}`);

            }
            return bot.sendMessage(chatId, `I don't understand`);
        } catch (e) {
            return bot.sendMessage(chatId, 'Какая-то ошибка!');
        }
    })

    bot.on('callback_query', async msg => {
                const data = msg.data;
                const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }
        const user = await UserModel.findOne({chatId})

                if (data === String(chats[chatId])) {
                    user.right += 1;
                   await bot.sendMessage(chatId,`You win: ${chats[chatId]}`, againOptions);
                } else {
                    user.wrong += 1;
                   await bot.sendMessage(chatId,`You lose, try again ${chats[chatId]}`, againOptions);
                }
        await user.save();
    })
}

start()