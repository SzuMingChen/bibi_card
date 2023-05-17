const absentModel = require("../model/absent");
const responseStatus = require("../utils/response-status");

const absentController = {
    //! 取得所有欄位
    // getTime: async (req, res) => {
    //     const result = await absentModel.absentSelect();
    //     const result_ans = result.map((data) => {
    //         const start_date = data?.start_time.split(' ');
    //         const end_date = data?.end_time.split(' ');
    //         return {
    //             group: data?.join_group,
    //             name: data?.real_name,
    //             startDate: start_date[0],
    //             startTime: start_date[1],
    //             endDate: end_date[0],
    //             endTime: end_date[1],
    //             leaveTotal: data?.total_time,
    //             leaveReason: data?.reason,
    //             attributes: data?.attributes,
    //             uid: data?.uid,
    //             id:data?.id
    //         }
    //     })
        
    //     if (!result) {return res(responseStatus.ABSENT_SELECT_ERROR);}
    //     return res(responseStatus.SUCCESS, result_ans);
    // },
    //! 搜尋特定值
    selectById: async ( req, res ) => {
        // 前端送物件的資料(都在req裏面) 拿出要用的uid 
        // const { uid } = req; //* 依據uid搜尋特定人
        const { page, pageSize, sort, sortTarget, column } = req;
        // const result = uid ? await absentModel.absentGetOneRow(page, pageSize, sort, sortTarget, column) : await absentModel.absentSelect();
        const result = await absentModel.absentGetOneRow(page, pageSize, sort, sortTarget, column);
        console.log('result:::????',result);
        try {
            if (!Array.isArray(result)) throw "資料不正確"
            
            const result_ans = result.map((data) => {
                // const start_date = data?.start_time.split(' ');
                // const end_date = data?.end_time.split(' ');
                return {
                    group: data?.join_group,
                    name: data?.real_name,
                    startDate: data?.start_date,
                    startTime: data?.start_time,
                    endDate: data?.end_date,
                    endTime: data?.end_time,
                    leaveTotal: data?.total_time,
                    leaveReason: data?.reason,
                    attributes: data?.attributes,
                    uid: data?.uid,
                    id:data?.id
                }
            })
                 //! res(1,2) 的用法 就是 第一個 放responseStatus 第二個 放Data
        return res(responseStatus.SUCCESS,result_ans);
        } catch (error) {
            return res(responseStatus.ABSENT_SELECT_ERROR);
        }
    },
    //! 寫入請假資訊
    insertTime: async (req, res) => {
        console.log('|req|::::::',req);
        const result = await absentModel.absentCheckIn(req);

        if (!result) {return res(responseStatus.ABSENT_INSERT_ERROR);}
        return res(responseStatus.SUCCESS, result);
    },
    //! 修改請假內容
    editTime: async (req, res) => {

        const result = await absentModel.absentEdit(req, req.id);

        if (!result) {return res(responseStatus.ABSENT_UPDATE_ERROR);}
        return res(responseStatus.SUCCESS, result);
    },
    //! 刪除請假欄位
    deleteTime: async (req, res) => {
        const { id } = req;
        // const uid = "785452";

        //! 照理來說 刪除遲到紀錄 應該是會攜帶id 指定的row 刪除 或是對照 id跟 uid 一起比對
        const result = await absentModel.absentDelete(req.id);

        if (!result) {return res(responseStatus.ABSENT_DELETE_ERROR);}
        return res(responseStatus.SUCCESS, result);
    }

}

module.exports = absentController;

//單頁測試用，跨頁請關閉
// absentController.demoSelect();
// absentController.getTime("",{json:(aa)=>{console.log(aa);}});
// absentController.insertTime("",{json:(aa)=>{console.log(aa);}});
// absentController.editTime("",{json:(aa)=>{console.log(aa);}});
// absentController.deleteTime("",{json:(aa)=>{console.log(aa);}});
// absentController.selectById("",{json:(aa)=>{console.log(aa);}});

// const { send } = require('../utils/tool');

//! 取得欄位
// absentController.getTime( {  }, (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// })

//! 取特定欄位
// absentController.selectById( { uid:'3246465' }, (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// })


//! 寫入請假資訊
// absentController.insertTime(
//     {     
//         uid: '9999',
//         reason: '病假',
//         start_time: '2023-3-28 12:00',
//         end_time: '2023-3-28 16:00',
//         attributes: '',
//         update_uid: 'system'
//     },
//     (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// })


//! 修改請假內容
// absentController.editTime( {  
//     reason:"事假",
//     drop:0,
//     uid:"9999"   
//  }, (responseStatus, data) => {
    
//         console.log(send(responseStatus, data));
//     })

     //! 刪除請假欄位
    // absentController.deleteTime( {  
    //     uid:'1234'   
    //  }, (responseStatus, data) => {
        
    //         console.log(send(responseStatus, data));
    //     })
