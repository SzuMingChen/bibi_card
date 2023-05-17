const attendanceModel = require("../model/attendance");
const { readSpecificDate , update,  } = attendanceModel;
const accountModel = require("../model/account");
const absentModel = require("../model/absent");

const responseStatus = require("../utils/response-status");


console.log( new Date().toLocaleDateString());
console.log( new Date().toTimeString().slice(0, 8));

const attendanceController = {
    //# 前台打卡
    checkInOut: async (cardInfo, callback) => {
        if (cardInfo === undefined) return console.log("|checkInOut| cardInfo 資料異常");;
        const { msg_tag, machine_mac, machine_ip, machine_id, card_type, card_id } = cardInfo;
        console.log(card_id);
        //step 執行model function
        //step 先查看帳戶是否有該對應的卡片對象 
        const barcodeANS = await accountModel.readSpecificByBarcode(card_id);
        //! 如果沒有相對應的角色 直接回絕並且log查無此人
        if (barcodeANS?.length !== 1) return console.log("查無此卡片感應者");
        const uid = barcodeANS[0].uid
        const date = new Date()
        const yymmdd = date.toLocaleDateString().replace(/\//g, '-');
        const hhmmss = date.toTimeString().slice(0, 8);
        console.log("GGGGGHHHHHSSSS",yymmdd,hhmmss);

        //step 撈出使用者簽到紀錄
        const attendanceInfo = await readSpecificDate(uid,yymmdd);
        console.log("checkInOut checkInOut checkInOut", attendanceInfo);

        let checkinInfo;
        let ans;
        try {
            

        if (attendanceInfo.length === 0 && date.getHours() < 10) {
            checkinInfo = {
                uid,
                date: yymmdd,
                checkin_time: hhmmss,
                attributes: "簽到",
            }
            ans = await attendanceModel.insert(checkinInfo);
            console.log(ans);
        }else if(attendanceInfo.length === 0 && date.getHours() <= 12){
            checkinInfo = {
                uid,
                date: yymmdd,
                checkin_time: hhmmss,
                attributes: "遲到",
            }
            ans = await attendanceModel.insert(checkinInfo);
            console.log(ans);
        }else if(attendanceInfo.length === 0 && date.getHours() >= 12 && date.getHours() < 17){
            console.log(attendanceInfo.length === 0);
            console.log(date.getHours() > 12);
            console.log(date.getHours() < 17);
            checkinInfo = {
                uid,
                date: yymmdd,
                checkout_time: hhmmss,
                attributes: "早退",
            }
            console.log("|打卡-早退|",checkinInfo);
            ans = await attendanceModel.insert(checkinInfo);
            console.log("|打卡-早退|",ans);
        }else if(attendanceInfo.length === 0 && date.getHours() >= 17){
            console.log("???");
            checkinInfo = {
                uid,
                date: yymmdd,
                checkout_time: hhmmss,
                attributes: "簽退",
            }
            ans = await attendanceModel.insert(checkinInfo);
            console.log(ans);
        }

        if(attendanceInfo.length === 1 && date.getHours() >= 17){
            if (attendanceInfo[0].checkout_time) return console.log("已簽退");;
            checkinInfo = {
                checkout_time: hhmmss,
                attributes: "簽退",
            }
            ans = await attendanceModel.update(checkinInfo,uid, yymmdd);
            console.log(ans);
        }
        
        console.log("========================\\======================");
        console.log(barcodeANS);
        if (checkinInfo === undefined) return callback(responseStatus.ATTENDANCE_ADDSIGN_ERROR)
        checkinInfo.name = barcodeANS[0]?.real_name;
        console.log(checkinInfo);
        //step  打卡步驟完成後直接 推給前中台
        const notification = {
            target: `打卡🧵`,
            msg: `${barcodeANS[0]?.real_name} 在 ${hhmmss} ${checkinInfo.attributes}`,
            visible: true
        };  
        return callback(responseStatus.SUCCESS,checkinInfo,notification)
    } catch (error) {
            console.log(error);
    }

    },

    //!=> 先不用
    // reloadList: async(req, res) => {
    //     // const {page, pageSize, sort, sortTarget} = req.body;
    //     const {page, pageSize, sort, sortTarget} = req;
    //     const result1 = await attendanceModel.readByPage(page, pageSize, sort, sortTarget);
    //     const result2 = await attendanceModel.count();
    //     let result3 = [];
    //     console.log(1, result1);
    //     //根據找出來的uid去迴圈找東西，組成array
    //     for (let i = 0; i < result1.length; i++) {
    //         let uidList = await accountModel.selectBiUid(result1[i].uid);
    //         result3.push(uidList[0].real_name);
    //     }
    //     // console.log(3, result3);
    //     console.log('控制層reloadList:::', result3);
    //     //回傳格式
    //     let data ={
    //         total:'',
    //         list:[
    //             {
    //                 join_group:'',
    //                 real_name:'',
    //                 date:'',
    //                 checkin_time:'',
    //                 checkout_time:'',
    //                 check_total_time:'',
    //                 // absent:'',
    //                 attributes:''
    //             }
    //         ]
    //     }
    //     if (result1.code) return res(responseStatus.ATTENDANCE_RELOALIST_ERROR);
    //     if (result2.cose) return res(responseStatus.ATTENDANCE_RELOALIST_COUNT_ERROR);
        
    //     data.total = result2[0].total
    //     for (let i = 0; i < result1.length; i++) {
    //         data.list[i] = {
    //             join_group:result1[i].join_group,
    //             real_name:result3[i],
    //             date:new Date(result1[i].date).toLocaleDateString(),
    //             checkin_time:new Date(result1[i].checkin_time).toLocaleTimeString('en-US'),
    //             checkout_time:new Date(result1[i].checkout_time).toLocaleTimeString('en-US'),
    //             // check_total_time:result1[i].check_total_time,
    //             // absent:'',
    //             attributes:result1[i].attributes
    //         }
            
    //     }

    //     console.log('reloadList回傳前端的資料:::', data);
    //     return res(responseStatus.SUCCESS, data);
    // },

    //! 中台載入&&查詢  => OK  => 確認前台可以收到
    select: async (req, res) => {
        // console.log('|req|::::',req);
        // const {page, pageSize, sort, sortTarget, column} = req;
        const { page, pageSize, sort, sortTarget, column } = req;
        console.log(req);
        const result1 = await attendanceModel.selectByColumn(page, pageSize, sort, sortTarget, column);//沒有搜尋的話就是按照時間排序(先寫死)
        const result2 = await attendanceModel.searchCount(page, pageSize, sort, sortTarget, column);
        let result3 = [];
        // console.log(1, result1);
        //根據找出來的uid去迴圈找東西，組成array
        for (let i = 0; i < result1.length; i++) {
            let uidList = await accountModel.selectBiUid(result1[i].uid);
            result3.push(uidList[0].real_name);
        }
        console.log('***************',result3);
        // console.log('控制層select:::', result1, result2);
        
        if (result1.code) return res(responseStatus.ATTENDANCE_RELOALIST_ERROR);
        if (result2.cose) return res(responseStatus.ATTENDANCE_RELOALIST_COUNT_ERROR);
        // 回傳格式
        let data ={
            total:result2,
            list:[]
        }
        // console.log('----------------------',result1);
        for (let i = 0; i < result1.length; i++) {
            //# 如果沒有資料的話就是會替代 - or 其他空值
            let checkin_time = (result1[i].checkin_time !== null)? result1[i].checkin_time: "-";
            let checkout_time = (result1[i].checkout_time !== null)? result1[i].checkout_time: "-";
            console.log(checkout_time);
            data.list[i] = {
                uid:result1[i].uid,
                join_group:result1[i].join_group,
                real_name:result3[i],
                date:new Date(result1[i].date).toLocaleDateString(),
                checkin_time,
                checkout_time,
                // check_total_time:result1[i].check_total_time,
                // absent:'',
                attributes:result1[i].attributes
            }
            
        }
        // console.log('***************',data);
        return res(responseStatus.SUCCESS,data);
    },

    //! 中台補簽到, 補簽退, 刪除 => OK
    edit: async (req, res) => {
        const { uid, date, editTarget, time } = req;
        // console.log("EEEEEDDDDD",new Date().toLocaleT());
        let editData = {}
        
        if (editTarget === 'checkin_time'){ editData.checkin_time = time};
        if (editTarget === 'checkout_time') editData.checkout_time = time;
        if (editTarget === 'drop') editData.drop = '1';
        console.log('log::::::',req,editData);
        const result = await attendanceModel.update(editData, uid, date);
        console.log('控制層:::', result);
        // 如果成功  
        if (result.affectedRows !== 0) return res(responseStatus.SUCCESS);//成功

        // 如果失敗
        if (editTarget === 'checkin_time'||editTarget === 'checkout_time') {
            return res(responseStatus.ATTENDANCE_ADDSIGN_ERROR);//簽到/簽退失敗
        }

        // 其餘的都回應失敗
        return res(responseStatus.ATTENDANCE_DROP_ERROR);//刪除簽到記錄失敗
    }
}

module.exports = attendanceController;

//單頁測試用，跨頁請關閉

//前端reload要送過來
const req = {
    page:1,
    pageSize:2,
    sort: 'DESC',
    sortTarget: 'checkin_time'
}


//前端select搜尋時要送過來
const req2 = {
    page:1,
    pageSize:2,
    sort: 'DESC',
    sortTarget: 'checkin_time',
    column:{
        // checkin_time:'2023-03-29',
        // join_group: '1',
        // real_name: 'KOKO'
    }
}

//前端補簽到簽退送過來
const req3 = {
    uid:'koko',
    date: '2023-03-29',
    // editTarget:'checkin_time',//或者checkout_time(擇一)
    // time:'2023-01-01 10:10:10'//checkin_time或者checkout_time的時候才有，
    editTarget:'drop',//不需要傳其他值
}


// attendanceController.reloadList(req);
// attendanceController.select(req2);
// attendanceController.edit(req3);



//! 時間相減可以用這個
/*        const bbb = new Date("2023-03-29T08:08:43.100Z");
        const aaa = new Date();
        let ccc = new Date(aaa-bbb)
        console.log(123123);
        console.log(aaa);
        console.log(bbb);
        console.log(ccc);*/ 


// accountController.login({ account: "KO123", password:"ok234324" }, (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// })