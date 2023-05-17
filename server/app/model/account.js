const mysql = require("mysql2/promise");
const { dataBaseConfig } = require("../../config");
const db = mysql.createPool(dataBaseConfig);
const responseStatus = require("../utils/response-status");
const { _insert_ITF, _update_ITF } = require('../utils/sql-syntax');
let table_name = "bibi_clock`.`user_account";

async function accountSelect() {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = "SELECT * FROM bibi_clock.user_account WHERE `drop` = '0';";

        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        console.log('model層select:::', result);

        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層select ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}

async function accountSelectByUID(uid) {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = `SELECT * FROM \`bibi_clock\`.\`user_account\` WHERE \`uid\` = "${uid}" AND \`drop\` = '0';`;
        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        // console.log('model層select:::', result);
        if (result.length !== 1) return false;
        return result[0]
    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("|accountSelectByUID|model層select ERR:::" + error);
        throw responseStatus.MYSQL_CODE_ERROR
    }
}

async function selectBiUid(uid) {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = `SELECT * FROM bibi_clock.user_account WHERE uid = ${db.escape(uid)} AND \`drop\` = '0';`;

        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        // console.log('model層selectBiUid:::', result);

        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層selectBiUid ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}


async function createAccount(userData) {
    // 用try catch包住
    try {
        // let column = 
        // const {uid} = userData;
        //把SQL語法寫在target
        let target = "INSERT INTO bibi_clock.user_account set ?";

        //丟進去DB裡面執行
        const [result, fields] = await db.query(target, userData);
        console.log('model層註冊學員:::', result);
        if (result.affectedRows !== 1) throw "註冊失敗"
        //把結果拋出去 查到空的匯回傳 []
        console.log("學員註冊成功");
        return true;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層註冊學員 ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}
async function updateAccount(editData, uid) {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = _update_ITF(table_name, editData, `\`uid\` = "${uid}"`)

        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        console.log('model層編輯學員:::', result);

        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層編輯學員 ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}
async function deleteAccount(uid) {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = _update_ITF(table_name, { drop: 1 }, `(\`uid\` = '${uid}')`)

        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        console.log('model層刪除學員:::', result);

        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層刪除學員 ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}
async function count() {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = 'select count(*) as total from bibi_clock.user_account where \`drop\` = 0';

        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        console.log('model層數資料:::', result);

        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層數資料 ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}

//! 透過卡片讀取資料
async function readSpecificByBarcode(id) { // 閱讀,搜尋特定ID
    try {
        let target = `SELECT * FROM bibi_clock.user_account WHERE \`barcode\` = "${id}" AND \`drop\` = 0`;
        const [result, fields] = await db.query(target);
        console.log('------', result);
        return result;
    } catch (error) {
        console.log("model層attendance ERR:" + error);
        return responseStatus.MYSQL_CODE_ERROR;
    }
}



module.exports = {
    accountSelect,
    selectBiUid,
    createAccount,
    updateAccount,
    deleteAccount,
    // selectByColumn,
    readSpecificByBarcode,
    count,
    accountSelectByUID
}


//單頁測試用，跨頁請關閉
// let userData = {
//     uid: '785452',
//     real_name: 'ccc',
//     password: 'asd123',
//     barcode: '123456',
//     phone: '0988090090',
//     email: 'chihpy@gmail.com',
//     create_uid: '123',
//     join_group: '3',
// }
// let editData = {
//     name: '',
//     phone: ''
// }
// accountSelect();
// createAccount(userData);
// updateAccount(editData, 3);
// deleteAccount(456);
