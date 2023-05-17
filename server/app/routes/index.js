const express = require("express");
const router = express.Router();
const { absentCtl, accountCtl, attendanceCtl, bibiClockCtl } = require('../controller');
const {send} = require('../utils/tool');



module.exports = (app, io) => {
    app.post('/barcode',(req,res)=>{
        bibiClockCtl.barcodeMessagePackage(req,res,io)
    })

    //# 中台編輯線
    router.post('/sendToAdmin', (req, res) => {
        console.log("｜中台｜", req.body);
        const {card_id} = req.body;
        // step 解析資料

        // step model確認


        // step 傳送卡片資訊
        io.emit("get-card-id", { code: "0001", msg: "成功", data:{ card_id} });

        return res.json({ msg: '感應卡片成功~~~' });
    });

    //# 打卡線
    router.post('/sendToUser', (req, res) => {
        console.log("｜前台｜", req.body);
        // step 解析資料
        
        // step model確認回應
        attendanceCtl.checkInOut(req.body,(responseStatus, data, message)=>{
        io.emit("get-card-id",  send(responseStatus, data));
        io.emit("notification",  send(responseStatus, message));
        });

        return res.json({ msg: '打卡成功～～～' });
    });

    //! 假通知
    // let  i = 0;
    // setInterval(()=>{
    //     io.emit("notification",  send( {code: "0001", msg: "成功"}, {target: "上線🧵"+i, msg: "KOoo 剛剛登入，進入公會大廳，趕快回公會準備大戰。"}));
    //     i++
    // },Math.random()*3000)

    
    

    app.use(router);

};