const mysql = require("mysql2/promise");
const { _insert_ITF, _update_ITF } = require('../utils/sql-syntax');
const { dataBaseConfig } = require("../../config");
const db = mysql.createPool(dataBaseConfig);



function _DTF_reader_machine({machine_mac,machine_type,machine_id,machine_ip,machine_target,status}) {
    return{
        machine_mac,
        machine_type,
        machine_id,
        machine_ip,
        machine_target:  machine_target.split(','),
        status
      }
    
}



const reader_machine = new Map(); 
exports.readerMachineInit = async function () {

    const [row]  = await db.query('SELECT * FROM bibi_clock.reader_machine WHERE `drop` = 0 AND `status` = 1;');
    for (let i = 0; i < row.length; i++) {
        const {machine_mac} = row[i];
        reader_machine.set(machine_mac,_DTF_reader_machine(row[i]))
    }
    
}
this.readerMachineInit()

exports.reader_machine = reader_machine;

