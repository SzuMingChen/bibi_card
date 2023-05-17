const mysql = require("mysql2/promise");

//創建DB，檢測時請注意user名稱和密碼
async function createDB(dataBaseConnection, database) {
  let connection = "";
  try {
    connection = await mysql.createConnection(dataBaseConnection);
    await connection.query(`CREATE DATABASE ${database}`);
    return connection;
  } catch (error) {
    // console.log("error", error);
    return connection;
  }
}

//創建表單
async function createTable1(connection) {
  try {
    let target = "CREATE TABLE `bibi_clock`.`user_account` (`uid` VARCHAR(255) NOT NULL COMMENT '帳號',`real_name` VARCHAR(255) NOT NULL COMMENT '真實姓名',`password` VARCHAR(255) NULL COMMENT '密碼',`barcode` VARCHAR(255) NULL COMMENT '卡片條碼',`phone` VARCHAR(255) NULL COMMENT '電話',`email` VARCHAR(255) NULL COMMENT '電子信箱',`createtime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',`create_uid` VARCHAR(255) NULL COMMENT '創建人員帳號',`join_group` VARCHAR(255) NULL COMMENT '組別',`drop` INT NOT NULL DEFAULT 0 COMMENT '軟刪除，0=>存在，1=>刪除',PRIMARY KEY (`uid`));";
    //console.log(target);
    await connection.query(target);
  } catch (error) {
    console.log("createTable1 error:::", error);
  }
}


async function createTable2(connection) {
  try {
    let target = "CREATE TABLE `bibi_clock`.`attendance` (`id` INT NOT NULL AUTO_INCREMENT,`uid` VARCHAR(255) NOT NULL COMMENT '學員帳號',`checkin_time` VARCHAR(255) NULL COMMENT '簽到時間',`checkout_time` VARCHAR(255) NULL COMMENT '簽退時間',`check_total_time` VARCHAR(255) NULL COMMENT '累計上課時數',`attributes` VARCHAR(255) NOT NULL COMMENT '備註', `drop` INT NOT NULL DEFAULT 0 COMMENT '軟刪除，0=>存在，1=>刪除', PRIMARY KEY (`id`),INDEX `index2` (`uid` ASC) VISIBLE) COMMENT = '出缺席紀錄';";
    //console.log(target);
    await connection.query(target);
  } catch (error) {
    console.log("createTable2 error:::", error);
  }
}

async function createTable3(connection) {
  try {
    let target = "CREATE TABLE `bibi_clock`.`absent` (`id` INT NOT NULL AUTO_INCREMENT,`uid` VARCHAR(255) NOT NULL COMMENT '學員帳號',`reason` VARCHAR(255) NOT NULL COMMENT '請假理由',`start_date` VARCHAR(255) NOT NULL COMMENT '開始請假日期',`start_time` VARCHAR(255) NOT NULL COMMENT '開始請假時間',`end_date` VARCHAR(255) NOT NULL COMMENT '結束請假日期',`end_time` VARCHAR(255) NOT NULL COMMENT '結束請假時間',`total_time` VARCHAR(255) NOT NULL COMMENT '累計請假時間',`update_uid` VARCHAR(255) NOT NULL COMMENT '更新人員帳號',`updatetime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',`attributes` VARCHAR(255) NOT NULL COMMENT '備註',`drop` INT NOT NULL DEFAULT 0 COMMENT '軟刪除，0=>存在，1=>刪除', PRIMARY KEY (`id`),INDEX `index` (`uid` ASC) VISIBLE) COMMENT = '請假紀錄';"
    await connection.query(target);
  } catch (error) {
    console.log("createTable3 error:::", error);

  }
}


async function createTable4(connection) {
  try {
    let target = "CREATE TABLE `bibi_clock`.`reader_machine` (`machine_mac` varchar(255) NOT NULL COMMENT '硬體設備序號(mac)',`machine_type` varchar(255) DEFAULT NULL COMMENT '刷卡機的類別\n- 打卡機\n- 櫃檯編輯機',`machine_id` varchar(255) DEFAULT NULL COMMENT '刷卡機的編號',`machine_ip` varchar(255) DEFAULT NULL COMMENT '讀卡機的IP位置',`machine_target` varchar(255) DEFAULT NULL COMMENT '推送的目標',`status` int NOT NULL DEFAULT '-1' COMMENT '-1 => 創建時異常\n0 => 關閉讀卡機\n1 => 開啟讀卡機',`drop` int NOT NULL DEFAULT '0' COMMENT '0 => 未刪除\n1 => 軟刪除',PRIMARY KEY (`machine_mac`))"
    await connection.query(target);
  } catch (error) {
    console.log("createTable3 error:::", error);

  }
}

//初始化database
async function initSchema(dataBaseConnection, database) {
  const connection = await createDB(dataBaseConnection, database);
  createTable1(connection);
  createTable2(connection);
  createTable3(connection);
  createTable4(connection);
  console.log("資料庫及表單建立完成");
}


module.exports.initSchema = initSchema;