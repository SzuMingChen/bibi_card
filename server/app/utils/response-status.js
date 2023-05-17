const deepFreeze = require("./deep-freeze");

//! 根據需求而新增，有新增就在後面加上新增者的名字
const status = {
    //******************** system default error 00XX ********************** */
    SUCCESS: customRes('0001', '成功'),
    NOT_FOUND: customRes('0002', '找不到路徑'),
    DATA_PARSE_ERROR: customRes('0003', '資料解析失敗'),
    CHECK_CODE_LOST: customRes('0004', '缺少檢查碼'),
    CHECK_CODE_ERROR: customRes('0005', '檢查碼錯誤'),
    APIKEY_ERROR: customRes('0006', 'apikey錯誤'),
    REQUEST_VERIFY_ERROR: customRes('0007', '請求參數驗證錯誤'),
    SYSTEM_ERROR: customRes('9998', '系統錯誤'),
    UNKNOWN_ERROR: customRes('9999', '未知錯誤'),


    //******************** SQL error 01XX ********************** */
    MYSQL_CODE_ERROR: customRes('0101', '資料庫語法不正確'),//Emma


    //******************** account table error 02XX ********************** */
    ACCOUNT_EMPTY_ERROR: customRes('0201', '查無此帳號'), //Emma
    ACCOUNT_DUPLICATED_ERROR: customRes('0202', '帳號重複'), //Emma
    ACCOUNT_RELOAD_ERROR: customRes('0203', '帳號載入失敗'), //jasmine
    ACCOUNT_CREATE_ERROR: customRes('0204', '帳號註冊失敗'), //jasmine
    ACCOUNT_UPDATE_ERROR: customRes('0204', '帳號更新失敗'), //jasmine
    ACCOUNT_DELETE_ERROR: customRes('0204', '帳號刪除失敗'), //jasmine

    //******************** attendance table error 03XX ********************** */
    ATTENDANCE_ADDSIGN_ERROR: customRes('0301', '補簽到/簽退失敗'), //Emma
    ATTENDANCE_RELOALIST_ERROR: customRes('0302', '載入出席紀錄頁面資料失敗'),//Emma
    ATTENDANCE_RELOALIST_COUNT_ERROR: customRes('0303', '載入出席紀錄總數失敗'),//Emma
    ATTENDANCE_DROP_ERROR: customRes('0304', '刪除簽到記錄失敗'),//Emma

    




    //******************** absent table error 04XX ********************** */
    ABSENT_SELECT_ERROR: customRes('0401', '請假表載入失敗'), //jasmine
    ABSENT_INSERT_ERROR: customRes('0402', '請假登錄失敗'), //jasmine
    ABSENT_UPDATE_ERROR: customRes('0402', '請假表更新失敗'), //jasmine
    ABSENT_DELETE_ERROR: customRes('0402', '請假表刪除失敗'), //jasmine
}

function customRes(code, msg) {
    return {
        code: code,
        msg: msg || ""
    };
}

deepFreeze(status)

module.exports = status;