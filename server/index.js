// const express = require('express');
// const app = express();
// const serverPort = 12345;

// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173"
//   }
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", '*');
//   res.header("Access-Control-Allow-Headers", ['Content-Type', 'Content-Length', 'Authorization', 'Accept','X-Requested-With'].join(','));
//   res.header("Access-Control-Allow-Methods", ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'].join(','));
//   res.header("Access-Control-Allow-Credentials", true);

//   next();
// })
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }))


// app.use(express.static("public")); // html source path


// //! 
// // app.get('/',(req,res)=>{
// //   console.log("1234234");
// //   res.send("OKK")
// // })

// app.post('/sendToAdmin', (req, res) => {
//   console.log("｜中台｜", req.body);

//   return res.json({ msg: 'Hello World!' });
// });
// app.post('/sendToUser', (req, res) => {
//   console.log("｜前台｜", req.body);

//   return res.json({ msg: '打卡成功～～～' });
// });

// //!




// // app.get('/', (req, res) => {
// //     res.sendFile(__dirreal_name + '/index.html');
// //   });

// // io.on('connection', (socket) => {
// //     // console.log('a user connected');
// // //! 收到之後的處理
// // socket.on('chat message', (msg) => {
// //     console.log('message:' + msg);
// //     io.emit('chat message', msg);
// // });
// // })

// server.listen(serverPort, () => {
//   console.log(
//     `listen on ${serverPort}!!! 網址:http://localhost:${serverPort}/`
//   );
// });


// // const datebase = require("./database");

// // const aa = require('./app/model/absent');

const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



require('./app/socket')(io);
require('./app/routes')(app,io)


io.on('connect', client => {
  console.log("连接成功");
  client.emit("message", "你好啊！赛利亚");
})
io.on("connection", client => {
  client.emit("message", "你好！");

  // client.on("login", client => {
  //   console.log("123423");
  //   console.log(client);
  //   io.emit("message", "??");
  // })

});





http.listen(3000, function () {
  console.log('listening on *:3000');
});