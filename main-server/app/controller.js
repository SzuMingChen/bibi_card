const target = require('./fetch-config');
const { reader_machine } = require('../database');

const MessageQueue = require('../lib/message-queue');
const MQ = new MessageQueue();


function sendTarget(postData) {
    const { machine_mac } = postData;
    if (machine_mac === undefined) return console.log(`|Target Undefined| ${machine_mac}`);

    const targetList = reader_machine.get(machine_mac)?.machine_target;
    if (targetList === undefined) return console.log(`|Send Target Fail| ${machine_mac}`);

    for (let i = 0; i < targetList.length; i++) {
        target[targetList[i]](postData);
    }
}

exports.barcodeMessagePackage = async (req, res) => {
    // console.log("RFID_CODE", req.body);
    // console.log(req.body);
    if (!Array.isArray(req.body)) return res.send("資料格式異常");

    const postData = {
        msg_tag: `${req.body[8]}${req.body[7]}`, //structure 訊息數據包序列號
        machine_mac: req.body.slice(14, 21).join(''), //structure 硬件序號(每台設備獨一)
        machine_ip: req.body.slice(1, 4).join(''), //structure 讀卡機IP位置
        machine_id: `${req.body[6]}${req.body[5]}`, //structure 讀卡機ID
        card_type: req.body[0], //structure: 193 => IC卡
        card_id: req.body.slice(9, 13).join(''), //structure 感應卡ID
        main_send_time: new Date().toLocaleString(), //! 用不到只是記錄個時間戳
    }

    let task = {
        hash: `${postData.msg_tag}-${postData.card_id}`, //structure 排序編號
        callback: () => {
            sendTarget(postData);
            return "OK";
        },
    };

    //# task:任務 、 speed:結束hash的時間
    MQ.multitaskingExclusion(task, 5000);

    res.send('Hello World!');
}