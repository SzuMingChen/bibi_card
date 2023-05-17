const accountModel = require("../model/account");
const responseStatus = require('../utils/response-status');


const accountController = {
    //# 登入
    login: async (req, res) => {
        //step 拾取所需資料
        const { account, password: loginPassword } = req;

        //step 執行model function
        try {
            const { uid, real_name, password, barcode, join_group } = await accountModel.accountSelectByUID(account);
            //step 如果登入密碼跟 資料密碼相同 就回傳成功＆基礎資訊
            console.log(join_group);
            if (loginPassword === password && join_group === "0" ) {
                //! 資料回傳
                const responseDetail = { uid, real_name };
                return res(responseStatus.SUCCESS, responseDetail);
            }
    
            //step 其他都直接回穿失敗
            throw "userDetail undefined";
        } catch (error) {
            console.log(error);
            //! 錯誤回傳
            return res(responseStatus.ACCOUNT_RELOAD_ERROR);
        }



    },
    //! 取得所有帳號資訊
    getAccount: async (req, res) => {
        // const { page, pageSize, sort, target } = req.body;
        const result = await accountModel.accountSelect()

        const result_ans = [];
        for (let i = 0; i < result.length; i++) {
            //! 目前預設 管理員為"0" 所以如果是0的就跳過
            if (result[i].join_group === "0") continue;
            result_ans.push({
                uid: result[i]?.uid,
                group: result[i]?.join_group,
                name: result[i]?.real_name,
                phoneNumber: result[i]?.phone,
                email: result[i]?.email,
                cardNumber: result[i]?.barcode
            })
        }
        // console.log(result_ans);

        if (!result) { return res(responseStatus.ACCOUNT_RELOAD_ERROR); }
        return res(responseStatus.SUCCESS, result_ans);
    },
    //! 註冊新學員帳號
    createAccount: async (req, res) => {
        console.log(req);
        const {
            uid,
            name:real_name,
            cardNumber:barcode,
            phoneNumber:phone,
            email,
            admin_uid:create_uid,
            group:join_group,
        } = req;

        const createAccountInfo = {
            uid,
            real_name,
            password: "qwe1234",
            barcode,
            phone,
            email,
            join_group,
            create_uid
        }
        try {
            const result = await accountModel.createAccount(createAccountInfo);
            //# 註冊成功
            if (result !== true) throw "註冊失敗"
            return  res(responseStatus.SUCCESS);
        } catch (error) {
            //! 註冊成功以外都寫失敗
            return res(responseStatus.ACCOUNT_CREATE_ERROR)
        }
        


    },
    //! 更新指定帳號內容
    editAccount: async (req, res) => {
        const {
            name: real_name,
            phoneNumber: phone,
            email,
            group: join_group,
            cardNumber: barcode,
            uid,
        } = req;
        const updateInfo = { real_name, phone, email, join_group, barcode };

        const result = await accountModel.updateAccount(updateInfo, uid);

        if (result.affectedRows !== 1 && result.changedRows !== 0) { return res(responseStatus.ACCOUNT_UPDATE_ERROR); } //# 0204
        return res(responseStatus.SUCCESS, result);

    },
    //! 刪除學員帳號
    deleteAccount: async (req, res) => {
        const { uid } = req;

        const result = await accountModel.deleteAccount(uid);
        console.log(result);

        if (!result) { return res(responseStatus.ABSENT_DELETE_ERROR); }
        return res(responseStatus.SUCCESS);
    }
}

module.exports = accountController;

//單頁測試用，跨頁請關閉
// accountController.getAccount("", { json: (aa) => { console.log(aa); } });
// accountController.createAccount("",{json:(aa)=>{console.log(aa);}});
// accountController.editAccount("",{json:(aa)=>{console.log(aa);}});
// accountController.deleteAccount("",{json:(aa)=>{console.log(aa);}});


const { send } = require('../utils/tool');

// accountController.createAccount({
//     uid:"alwaysTesting",
//     password: "qwe1234",
//     name: "哺哺",
//     phoneNumber: "0987158449",
//     email: "wwefwe@gmail.com",
//     group: "3",
//     cardNumber:"938345398",
//     admin_uid: "admin01"
//   }, (responseStatus, data) => {

//     io.emit("student-add-response", send(responseStatus, data));
//     console.log(send(responseStatus, data));
// })

//! 取得帳號
// accountController.getAccount({}, (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// })

//! 創建帳號
// accountController.createAccount({
//     uid: '9999',
//     real_name: 'ddd',
//     password: 'asd123',
//     barcode: '123456',
//     phone: '0988090090',
//     email: 'chihpy@gmail.com',
//     create_uid: 'kkk',
//     join_group: '3',
// }, (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// });

//! 修改帳號
// accountController.editAccount({
//     uid:'9999',
//     real_name: 'ddd444',
//     phone: '888888',
//     email: '',
//     join_group: '3',
//     barcode: '123456',
// }, (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// });

//! 刪除帳號
// accountController.deleteAccount({
//     uid:'9999',
// }, (responseStatus, data) => {

//     console.log(send(responseStatus, data));
// });
// })
