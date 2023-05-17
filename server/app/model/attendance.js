const mysql = require("mysql2/promise");
const { _insert_ITF, _update_ITF } = require('../utils/sql-syntax');
const { dataBaseConfig } = require("../../config");
const db = mysql.createPool(dataBaseConfig);
const responseStatus = require("../utils/response-status");

let table_name = "bibi_clock`.`attendance";

const datatry = {
  id: '3',
  uid: '3',
  checkin_time: '6552',
  checkout_time: '122',
  check_total_time: '29',
  attributes: '10',
  drop: '62'
};

async function insert(addData) { //新增OK
  try {
    let target = _insert_ITF(table_name, addData);
    const [result, fields] = await db.query(target);
    // console.log('------',result);
    return result;
  } catch (error) {
    console.log("model層attendance ERR:" + error);
    return responseStatus.MYSQL_CODE_ERROR;
  }
}

async function read() { // 閱讀OK(篩檢 drop = 0 的條件)
  try {
    let target = "SELECT * FROM bibi_clock.attendance WHERE \`drop\` = 0";
    const [result, fields] = await db.query(target);
    // console.log('------',result);
    return result;
  } catch (error) {
    console.log("model層attendance ERR:" + error);
    return responseStatus.MYSQL_CODE_ERROR;
  }
}

async function readSpecific(uid) { // 閱讀,搜尋特定ID
  try {
    let target = `SELECT * FROM bibi_clock.attendance WHERE \`uid\` = "${uid}" AND \`drop\` = 0`;
    const [result, fields] = await db.query(target);
    console.log('------', result);
    return result;
  } catch (error) {
    console.log("model層attendance ERR:" + error);
    return responseStatus.MYSQL_CODE_ERROR;
  }
}

async function readSpecificDate(uid, date) { // 閱讀,搜尋特定ID
  try {
    let target = `SELECT * FROM bibi_clock.attendance WHERE \`uid\` = "${uid}" AND \`date\` = "${date}"  AND \`drop\` = 0`;
    const [result, fields] = await db.query(target);
    console.log('------', result);
    return result;
  } catch (error) {
    console.log("model層attendance ERR:" + error);
    return responseStatus.MYSQL_CODE_ERROR;
  }
}



async function update(editData, uid, date) { // 修改,類刪除
  try {
    console.log(db.escape(uid), db.escape(date));
    console.log("EEDDDDEDE", editData);
    let target = _update_ITF(table_name, editData, `\`uid\` = ${db.escape(uid)} AND \`date\` = ${db.escape(date)}`);
    console.log("NMMMMMMMM DATA", target);
    const [result, fields] = await db.query(target);
    console.log('------', result);
    if (result.affectedRows !== 1 && result.changedRows !== 1) throw "打卡更新失敗";
    return true;
  } catch (error) {
    console.log("model層attendance ERR:" + error);
    return responseStatus.MYSQL_CODE_ERROR;
  }
}

async function Delete(id) {  // 刪除,目前是手動刪除,暫時用不到
  try {
    let target = _update_ITF(table_name, { drop: 1 }, `\`id\` = "${id}"`);
    const [result, fields] = await db.query(target);
    console.log('------', result);
    return result;
  } catch (error) {
    console.log("model層attendance ERR:" + error);
    return responseStatus.MYSQL_CODE_ERROR;
  }
}

async function readByPage(page, pageSize, sort, sortTarget) {
  console.log(page, pageSize, sort, sortTarget);
  try {
    const target = `SELECT ua.join_group, ua.real_name, att.* 
    FROM attendance AS att LEFT JOIN user_account AS ua ON att.uid = ua.uid
    WHERE ua.\`drop\` = 0
    ORDER BY ${sortTarget} ${sort} 
    LIMIT ${(page - 1) * pageSize}, ${pageSize}`;
    const [result, fields] = await db.query(target);
    console.log('model層readByPage:::', result);
    return result
  } catch (error) {
    console.log("model層按照頁數排序顯示 ERR:::" + error);
    return responseStatus.MYSQL_CODE_ERROR
  }
}
//! 載入跟搜尋用 => OK
async function selectByColumn(page, pageSize, sort = "", sortTarget, column = {}) {
  let wheres = [];
  if (column.join_group) {
    wheres.push(`\`join_group\` =  ${db.escape(column.join_group)}`);
  }
  if (column.real_name) {
    wheres.push(`\`real_name\` LIKE ${db.escape("%" + column.real_name + "%")}`);
  }
  if (column.checkin_time) {
    wheres.push(`\`date\` LIKE ${db.escape("%" + column.checkin_time + "%")}`);
  }

  try {
    const target = `SELECT ua.join_group, ua.real_name, att.* 
    FROM attendance AS att LEFT JOIN user_account AS ua ON att.uid = ua.uid
    WHERE ${wheres.length > 0 ? `${wheres.join('AND')} AND` : ''} ua.\`drop\` = 0
    ORDER BY ${sortTarget} ${sort} 
    LIMIT ${(page - 1) * pageSize}, ${pageSize}`;
    // console.log(target);
    const [result, field] = await db.query(target);
    // console.log(result.length);
    return result;
  } catch (error) {
    console.log("model層搜尋結果的筆數selectByColumn ERR:::" + error);
    return responseStatus.MYSQL_CODE_ERROR
  }
}
//! 載入跟搜尋用 => OK
async function searchCount(page, pageSize, sort = "", sortTarget, column = {}) {
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
  console.log('attendance wheres::::????', wheres);
  try {
    const target = `SELECT ua.join_group, ua.real_name, att.* 
    FROM attendance AS att LEFT JOIN user_account AS ua ON att.uid = ua.uid
    WHERE ${wheres.length > 0 ? `${wheres.join('AND')} AND` : ''} ua.\`drop\` = 0
    ORDER BY ${sortTarget} ${sort} 
    LIMIT ${(page - 1) * pageSize}, ${pageSize}`;
    // console.log(target);
    const [result, field] = await db.query(target);
    // console.log(result.length);
    return result.length;
  } catch (error) {
    console.log("model層搜尋結果的筆數 ERR:::" + error);
    return responseStatus.MYSQL_CODE_ERROR
  }
}

async function count() {
  // 用try catch包住
  try {
    //把SQL語法寫在target
    let target = 'select count(*) as total from bibi_clock.attendance where \`drop\` = 0';

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


module.exports = {
  insert,
  read,
  readSpecific,
  update,
  readByPage,
  selectByColumn,
  readSpecificDate,
  count,
  searchCount
}
// insert(datatry);
// read();
// readSpecific();
// update();
// Delete();

// selectByColumn(1,2,'DESC',{join_group:'1', real_name:'ma'})