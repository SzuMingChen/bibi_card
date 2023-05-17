<script setup>
import { socket } from '../../../socket';
import { useAccountData } from '../../../stores/studentManage';

//! 啟用Pinia的變數
const {data, getStudentList, setData} = useAccountData();
const editData = {...data.editTarget};

const emit = defineEmits(['close']);

//TODO
const confirmDelete =  ()=>{
  console.log("學員管理編輯");
  //!!!! 需透過uid 來刪除學員
  socket.emit("student-drop", {
    uid: editData.uid
  });
}
</script>

<template>
    <div class="popUpBg flex_center">
        <div class="container">
            <header class="flex_center">
              <h1>學員刪除</h1>
            </header>
            <section class="flex_center">    
              <table>
                <tr height="40">
                  <td align="center" width="300">姓名</td>
                </tr>
                <tr height="40">
                  <td align="center" width="300">{{editData.name}}</td>
                </tr>
              </table>
            </section>
            <footer class="flex_center">
                <button class="cancleBtn" @click="emit('close', false)">取消</button>
                <button @click="confirmDelete">確認</button>
            </footer>
        </div>
    </div>    
</template>

<style lang="scss" scoped>
.popUpBg {
  position: fixed;
  margin: 0 auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(217, 217, 217, 0.5);;
}
.container{
  position: relative;
  display: flex;
  flex-direction: column;
  width: size(500);
  height: size(300);
  background-color: #FFFFFF;
  border-radius: size(4);
}
header{
  width: 100%;
  height: 30%;
}
.header h1{
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;    
}
section{
  width: 80%;
  height: 60%;
  margin: 0 auto;
}
table,th,td{
  border: 1px solid #c5c5c5;
  border-collapse: collapse;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
}
footer{   
  width: 100%;
  height: 20%;
}
footer button{   
  width: size(68);
  height: size(40);
}
.cancleBtn{
  margin-right: size(24);
  background-color: #FFFFFF;
  color: #000000;
  border: 1px solid #000000;
}
</style>