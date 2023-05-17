const { response } = require('express');
const { absentCtl, accountCtl, attendanceCtl } = require('../controller');
const {send} = require('../utils/tool');

module.exports = (io) => {
    io.on('connect', client => {
        
    })

};