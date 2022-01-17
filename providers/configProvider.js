const fs = require('fs')
const YAML = require('yaml')

module.exports.config = YAML.parse(fs.existsSync('config.yaml') ?
    fs.readFileSync('config.yaml', 'utf8') : process.env.RECORD_SERVER_CONFIG)
