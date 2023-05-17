const mysql = require("mysql2/promise");

/**
 * {table_name} 字串 e.g: 'bibi_clock.absent'
 *  
 * {data} 必須是一個物件 攜帶異動的欄位及值
 * 
 * {finder} 修改目標 e.g : `\`id\` = "${id}"`
 */
exports._update_ITF = function (table_name, data, finder) {
  let sql_query = '';
  sql_query += 'UPDATE `' + table_name + '` SET ';
  if (typeof data === 'object') {
    sql_query += mysql.escape(data);
  } else if (typeof data === 'string') {
    if (data !== '') {
      sql_query += ' ' + mysql.escape(data);
    }
  } else {
    return false;
  }
  sql_query += ' WHERE ' + finder + ';';
  return sql_query;
}


/**
 * {table_name} 字串 e.g: 'bibi_clock.absent'
 *  
 * {data} 必須是一個物件 可攜帶欄位
 *  - uid
 *  - reason
 *  - start_time
 *  - end_time
 *  - total_time
 *  - update_uid
 *  - updatetime
 *  - attributes
 *  - drop
 */
exports._insert_ITF = function (table_name, data) {
  let sql_query = '';
  sql_query += 'INSERT INTO `' + table_name + '`';

  if (typeof data === 'object') {
    const columns = [];
    const values = [];
    Object.keys(data).forEach((key) => {
      columns.push('`' + key + '`');
      values.push(mysql.escape(data[key]));
    });
    sql_query += ' (' + columns.join(', ') + ') VALUES (' + values.join(', ') + ')';
  } else if (typeof data === 'string') {
    if (data !== '') {
      sql_query += ' ' + mysql.escape(data);
    }
  } else {
    return false;
  }
  return sql_query;
}


