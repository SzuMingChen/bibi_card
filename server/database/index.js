const { dataBaseConfig, dataBaseConnection } = require("../config");
const { initSchema } = require("./schema");
const initilize = async () => {
  //初始化schema and tables
  await initSchema(dataBaseConnection, dataBaseConfig.database);
};
initilize();