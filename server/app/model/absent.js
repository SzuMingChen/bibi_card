const mysql = require("mysql2/promise");
const { dataBaseConfig } = require("../../config");
const db = mysql.createPool(dataBaseConfig);
const responseStatus = require("../utils/response-status");
let table_name = "bibi_clock`.`absent";
const { _insert_ITF, _update_ITF } = require('../utils/sql-syntax');
const count = 'select count(*) as total from bibi_clock.absent';

// # 缺席新增 ok
async function absentCheckIn(addData) {
    console.log('|model absentCheckIn :::::|', addData);
    // 用try catch包住
    try {
        const startTime = new Date(`${addData.start_date}T${addData.start_time}`);
        const endTime = new Date(`${addData.end_date}T${addData.end_time}`);
        const total_time = Math.floor(Math.abs(endTime.getTime() - startTime.getTime()) / 3600000);
        addData.total_time = total_time < 24 ? total_time + '小時' : Math.round(total_time / 24) + '天';
        addData.update_uid = 'system';
        //把SQL語法寫在target        
        let target = _insert_ITF(table_name, addData);
        // console.log('model absentCheckIn::::::', target);
        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        // console.log('model層absentCheckIn:::', result);

        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層absentCheckIn ERR:::" + error);
        return;
    }
}

// #  缺席搜尋  - 未被刪除的帳號 條件式搜尋 及 併表顯示 ok
async function absentSelect() {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = "SELECT a.*, `b`.`join_group`, `b`.`real_name` FROM `bibi_clock`.`absent` AS a LEFT JOIN `bibi_clock`.`user_account` AS b ON a.uid = b.uid WHERE a.`drop` = '0';"
        //丟進去DB裡面執行
        const [result] = await db.query(target);
        console.log('model層absentSelect:::', result);
        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層absentSelect ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}

// #  缺席搜尋 - 條件式搜尋 
// async function absentGetOneRow(uid) {
async function absentGetOneRow(page, pageSize, sort = "", sortTarget, column = {}) {
    const wheres = [];
    if (column.join_group) wheres.push(`\`join_group\` = ${db.escape(column.join_group)}`);
    if (column.real_name) wheres.push(`\`real_name\` LIKE ${db.escape(column.real_name)}`);
    if (column.checkin_time) wheres.push(`\`start_date\` LIKE ${db.escape(column.checkin_time)}`);
    // 用try catch包住
    try {
        //把SQL語法寫在target
        // let target = `SELECT a.*, \`b\`.\`join_group\`, \`b\`.\`real_name\` FROM \`bibi_clock\`.\`absent\` AS a LEFT JOIN \`bibi_clock\`.\`user_account\` AS b ON a.uid = b.uid WHERE a.\`drop\` = '0' AND a.\`uid\` = ${db.escape(uid)};`
        let target = `SELECT ua.join_group, ua.real_name, \`as\`.* 
        FROM bibi_clock.absent AS \`as\` LEFT JOIN bibi_clock.user_account AS ua ON \`as\`.uid = ua.uid
        WHERE ${wheres.length > 0 ? `${wheres.join(' AND ')} AND` : ''} \`as\`.\`drop\` = 0
        ORDER BY \`${sortTarget}\` ${sort.toUpperCase()}
        LIMIT ${(page - 1) * pageSize}, ${pageSize}`;
        // console.log('absentGetOneRow target :::: ~~~~', target);
        //丟進去DB裡面執行
        const [result] = await db.query(target);
        // console.log('model層absentGetOneRow:::', result);
        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層absentGetOneRow ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}

// # 缺席編輯  ok
/**
 * {editData} 必須是要一個物件，可攜帶欄位:
 *  - reason
 *  - start_time
 *  - end_time
 *  - attributes
 *  - drop
 * 
 *  {id} 必須是要一個數字
 */
async function absentEdit(editData, id) {
    // 用try catch包住
    try {
        const startTime = new Date(`${editData.start_date}T${editData.start_time}`);
        const endTime = new Date(`${editData.end_date}T${editData.end_time}`);
        const total_time = Math.floor(Math.abs(endTime.getTime() - startTime.getTime()) / 3600000);
        editData.total_time = total_time < 24 ? total_time + '小時' : Math.round(total_time / 24) + '天';
        //把SQL語法寫在target
        let target = _update_ITF(table_name, editData, `\`id\` = '${id}'`);
        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        // console.log('model層absentEdit:::', result);
        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層absentEdit ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}
// # 刪除缺席紀錄 ok
async function absentDelete(id) {
    // 用try catch包住
    try {
        //把SQL語法寫在target
        let target = _update_ITF(table_name, { drop: 1 }, `(\`id\` = '${id}')`);
        // console.log('delete target #####', target);
        //丟進去DB裡面執行
        const [result, fields] = await db.query(target);
        // console.log('model層absentDelete:::', result);

        //把結果拋出去 查到空的匯回傳 []
        return result;

    } catch (error) {
        //把錯誤 0101:資料庫語法不正確 回應出去
        console.log("model層absentDelete ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}

// #  缺席紀錄頁碼
async function absentPageSize(page, pageSize) {
    try {
        const target = `SELECT ua.join_group, ua.real_name, att.* 
        FROM attendance AS att LEFT JOIN user_account AS ua ON att.uid = ua.uid
        WHERE ua.\`drop\` = 0
        ORDER BY ${column} ${sort} 
        LIMIT ${(page - 1) * pageSize}, ${pageSize}`;

        const [result, fields] = await db.query(target);
        // console.log('model層readByPage:::', result);
        return result
    } catch (error) {
        console.log("model層按照頁數排序顯示 ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}

async function selectByColumn(page, pageSize, sort = "", sortTarget, column = {}) {
    let wheres = [];
    if (column.join_group) {
        wheres.push(`\`join_group\` =  ${db.escape(column.join_group)}`);
    }
    if (column.real_name) {
        wheres.push(`\`real_name\` LIKE ${db.escape("%" + column.real_name + "%")}`);
    }
    if (column.checkin_time) {
        wheres.push(`\`checkin_time\` LIKE ${db.escape("%" + column.checkin_time + "%")}`);
    }
    try {
        const target = `SELECT ua.join_group, ua.real_name, att.* 
        FROM attendance AS att LEFT JOIN user_account AS ua ON att.uid = ua.uid
        WHERE ${wheres.length > 0 ? `${wheres.join('AND')} AND` : ''} ua.\`drop\` = 0
        ORDER BY ${sortTarget} ${sort} 
        LIMIT ${(page - 1) * pageSize}, ${pageSize}`;
        console.log(target);
        const [result, field] = await db.query(target);
        console.log(result);
        return result
    } catch (error) {
        console.log("model層將搜尋解果按照頁數排序顯示 ERR:::" + error);
        return responseStatus.MYSQL_CODE_ERROR
    }
}


module.exports = {
    absentCheckIn,
    absentSelect,
    absentGetOneRow,
    absentEdit,
    absentDelete,
    absentPageSize,
    absentGetOneRow,
    selectByColumn,
}


//單頁測試用，跨頁請關閉
