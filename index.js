const express = require('express')
const fs = require('fs')
const {config} = require('./providers/configProvider')
const app = express()
const cors = require('cors')
app.use(cors())
const md5=require('md5')
const {bot} = require('./providers/oicqProvider')

if(!fs.existsSync('cache'))
    fs.mkdirSync('cache')

app.get('/api/records', async (req, resp) => {
    let {res, sign} = req.query
    if(!sign)
        return resp.status(400).send('Missing sign')
    if(!res)
        return resp.status(400).send('Missing res')

    res = res.replace(/ /g, '+')
    const resMd5 = md5(res)
    if (sign !== md5(resMd5 + config.token)){
        return resp.status(400).send('Invalid sign')
    }

    let data

    try{
        if (fs.existsSync('cache/' + resMd5 + '.json'))
            data = JSON.parse(fs.readFileSync('cache/' + resMd5 + '.json', 'utf-8'))
        else {
            data = await bot.getForwardMsg(res)
            if (!data.error)
                fs.writeFile('cache/' + resMd5 + '.json', JSON.stringify(data), 'utf-8', () => 0)
        }
    }
    catch (e){
        console.log(e)
        return resp.status(500).send('Internal server error')
    }

    resp.send(data)
})

if(fs.existsSync(config.unix))
    fs.unlinkSync(config.unix)

app.listen(config.unix, ()=>{
    console.log('Server started')
})
