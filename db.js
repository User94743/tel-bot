const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'tel_db',
    'camry',
    'w194RX3gs2fJ',
    {
        host: '95.213.158.253',
        port: '6432',
        dialect: 'postgres'
    }
)