
import { io } from "socket.io-client";

//或者 import io from "socket.io-client";
//const socket = io(path, options)
export const socket = io('http://192.168.25.101:8384',
    {
        path: '',
        transports: ['websocket', 'xhr-polling', 'jsonp-polling']
    })
socket.on("connect", (res) => {
    console.log("#connect: ", res);
});
socket.on("message", (res) => {
    console.log("#message: ", res);
});
socket.on('disconnect', () => {
    console.log('断开连接')``
})
socket.on(socket.id, (msg) => {
    console.log(msg)
})

// // step 獲取卡片
// socket.on("get-card-id",(msg) => {
//     console.log("#get-card-id: ", msg);
//     if (msg.code !== "0001") return ;

//     const { card_id } = msg.data;
//     console.log("|card_id| ", card_id);

// });


// // example 引入看login
// // example 監聽的範例


// // step 出勤搜尋
// socket.emit("attendance", {
//     start_time: " ",
//     end_time: " ",
//     group: " ",
//     real_name: " "
// });

// // step 出勤搜尋
// socket.emit("attendance-edit", {
//     id: '',
//     sign: " checkin_time, checkout_time",
//     time: "time",
// });

// // step 學員管理搜尋
// socket.emit("student");





// // step 學員管理編輯
// socket.emit("student-edit", {
//     uid: "",
//     real_name:"",
//     phone:"",
//     email:"",
//     group:"",
//     card_number:"",
//     });
    
// // step 學員管理編輯
// socket.emit("student-drop", {
//     uid: "",
//     });


// // step請假搜尋
// socket.emit("absent", {
//     start_time: " ",
//     end_time: " ",
//     group: " ",
//     real_name: " "
// });


// // step請假新增
// socket.emit("absent-add",{
//     real_name:"",
//     group:"",
//     start_time:"",
//     end_time:"",
//     reason:"",
//     attributes:"",
//     })

// // step請假編輯
// socket.emit("absent-edit",{
//     real_name:"",
//     group:"",
//     start_time:"",
//     end_time:"",
//     reason:"",
//     attributes:"",
//     })


// // step請假刪除
// socket.emit("absent-delete",{
//  uid:'',
//     })

