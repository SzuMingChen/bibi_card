<script setup>
import {useNotification} from '../../stores/notification';
import { socket } from '../../socket.js';

const notification = useNotification();
const {notificationList} = notification;





</script>

<template>
  <div >
    <div class="notification_container" v-for=" noti in notificationList" >
      <label >【通知】{{noti.target}}</label>
      <p>{{ noti.msg }}</p>
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
  background-color: rgba(217, 217, 217, 0.5);
}

.notification_container {
  position: relative;
  margin-right: 10px;
  display: flex;
  direction: ltr;
  flex-direction: column;
  padding: 10px;
  width: size(400);
  // height: size(150);
  height: auto;
  background-color: #cecece;
  border-radius: size(10);
}

header {
  width: 100%;
  height: 20%;
}

header h1 {
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
}

section {
  width: 100%;
  height: 60%;
}

footer {
  width: 100%;
  height: 20%;
}

footer button {
  width: size(68);
  height: size(40);
}
</style>