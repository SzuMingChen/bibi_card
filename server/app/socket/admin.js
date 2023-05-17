const { absentCtl, accountCtl, attendanceCtl } = require('../controller');
const { send } = require('../utils/tool');


module.exports = (io) => {
    io.on('connect', async(client) => {
        console.log(client.id);

//         const userId = await fetchUserId(client);
// console.log("userId",userId);
//         client.join(userId);
      
//         // and then later
        const rooms = io.of("/").adapter.rooms;
        // example 範例
        // step 登入
        client.on("login", async (msg) => {
            //step 執行任務
            console.log("|SOCKET| login");
            accountCtl.login(msg, (responseStatus, data) => {
                console.log('213::', msg);
                if (responseStatus?.code === "0001") {
                    client.join("admin-room");
                    io.emit("admin-room", "登入成功 admin-room"+new Date().toLocaleString());
                    console.log(rooms);

                }
                io.to(client.id).emit("login-response", send(responseStatus, data));
            });
        })

        // step 出勤搜尋
        client.on("attendance", async (msg) => {
            //step 執行任務
            console.log("|SOCKET| attendance");
            console.log("|SOCKET| attendance");
            attendanceCtl.select(msg, (responseStatus, data) => {
                io.to(client.id).emit("attendance-response", send(responseStatus, data));
            })
        })

        // step 出勤編輯
        client.on("attendance-edit", msg => {
            //step 執行任務
            console.log("|SOCKET| attendance-edit");
            //TODO 尚未增加func
            attendanceCtl.edit(msg, (responseStatus, data) => {
                io.to(client.id).emit("attendance-edit-response", send(responseStatus, data));
            })
        })

        // step 學員管理搜尋
        client.on("student", msg => {
            console.log("|SOCKET| student");
            accountCtl.getAccount(msg, (responseStatus, data) => {
                io.to(client.id).emit("student-response", send(responseStatus, data));
            })
        })


        // step 學員管理新增
        client.on("student-add", msg => {
            console.log("|SOCKET| student-add");
            accountCtl.createAccount(msg, (responseStatus, data) => {
                io.to(client.id).emit("student-add-response", send(responseStatus, data));
            })
        })

        // step 學員管理編輯
        client.on("student-edit", msg => {
            console.log("|SOCKET| student-edit");
            accountCtl.editAccount(msg, (responseStatus, data) => {
                io.to(client.id).emit("student-edit-response", send(responseStatus, data));
            })
        })

        // step 學員管理刪除
        client.on("student-drop", msg => {
            console.log("|SOCKET| student-drop");
            accountCtl.deleteAccount(msg, (responseStatus, data) => {
                io.to(client.id).emit("student-drop-response", send(responseStatus, data));
            })
        })


        // step 請假管理搜尋
        client.on("absent", msg => {
            console.log("|SOCKET| absent");
            // absentCtl.getTime(msg, (responseStatus, data) => {
            //     io.emit("absent-response", send(responseStatus, data));
            // })
            absentCtl.selectById(msg, (responseStatus, data) => {
                io.to(client.id).emit("absent-response", send(responseStatus, data));
            })
        })

        // step 請假管理新增
        client.on("absent-add", msg => {
            console.log("|SOCKET| absent-add");
            absentCtl.insertTime(msg, (responseStatus, data) => {
                io.to(client.id).emit("absent-add-response", send(responseStatus, data));
            })
        })

        // step 請假管理編輯
        client.on("absent-edit", msg => {
            console.log("|SOCKET| absent-edit");
            absentCtl.editTime(msg, (responseStatus, data) => {
                io.to(client.id).emit("absent-edit-response", send(responseStatus, data));
            })
        })


        // step 請假管理刪除
        client.on("absent-delete", msg => {
            console.log("|SOCKET| absent-delete");
            absentCtl.deleteTime(msg, (responseStatus, data) => {
                io.to(client.id).emit("absent-delete-response", send(responseStatus, data));
            })
        })





    })

};