const createClient = require('oicq').createClient
const {config} = require('./configProvider')

const bot = module.exports.bot = createClient(config.account, {
    platform: 1,
})

bot.login(config.password)
