<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { socket } from '../../socket.js';
import { useLogin } from '../../stores/login';

const router = useRouter();
const loginPinia = useLogin();

let account = ref("admin01");
let password = ref("qwe123");


const login = ()=>{
  //! 如果 input account 規格不符拒絕
  //! 如果 input password 規格不符拒絕

  //# 條件都達成後向後端發送登入請求
  socket.emit("login",{account:account.value, password:password.value});
}

socket.on("login-response", (res) => {
  console.log(res);

    //! 錯誤處理 res 回傳的內容 { code, msg, data?}
    if(res?.code === "0001"){ 
      //! 跳轉前將使用者基本資料倒入存放區 
      router.push('/attendanceSearch');
      loginPinia.admin_uid = res.data.uid;
    }
    //! 跳視窗
    console.log("登入失敗", res?.msg);       
});
socket.on("admin-room", (msg) => {
  console.log("|admin-room|",msg); 
});


</script>

<template>
  <div class="container">
    <img class="ketchup img_setting" src="../../assets/img/ketchup.png" alt="番茄罐">
    <div class="inputAndBtn">
      <div class="inputContainer">
        <div>
          <label for="account">帳號</label>
          <input type="text" id="account" autocomplete="new-password" v-model="account">
        </div>
        <div>
          <label for="password">密碼</label>
          <input type="password" id="password" autocomplete="new-password" v-model="password">
        </div>
      </div>
      <div class="btnContainer">
        <!-- <button @click="aa">登入</button> -->
        <button @click="login">登入</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
}

.ketchup {
  position: absolute;
  top: size(149);
  left: size(387);
  width: size(1060);
  height: size(607);
}

.inputAndBtn {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: size(814);
  left: size(1314);
  width: size(465);
  height: size(126);
}

.inputContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: size(340);
  height: size(108);
}

.inputContainer input {
  margin-left: size(32);
  width: size(228);
  height: size(40);
  border-radius: size(4);
}

.btnContainer {
  width: size(94);
  height: size(108);
}

.btnContainer button {
  width: 100%;
  height: 100%;
  font-weight: 500;
  font-size: 24px;
  line-height: 22px;
}
</style>