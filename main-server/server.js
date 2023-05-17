const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const express = require('express');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let serverPort;

const getArg = (rl) => new Promise((resolve, reject) => {
    let ip;
    let port;

  rl.question("請輸入Server Port: ", (insertPort) => {
    serverPort = insertPort;
    console.log(serverPort);
    resolve();

    rl.question("請輸入發送位子ip: ", (insertIp) => {
      console.log(`你輸入的ip: ${insertIp}`);

    })
  })

})




const { readerMachineInit, } = require('./database');
async function init() {
  await getArg(rl);
  await readerMachineInit();
}

init()
  .then(() => {



    const controller = require('./app/controller');
    app.post('/barcode', controller.barcodeMessagePackage)

    app.listen(serverPort, () => {
      console.log(`Example app listening on port ${serverPort}`)
    })

  })
  .catch((err) => {
    console.log(err);
  })