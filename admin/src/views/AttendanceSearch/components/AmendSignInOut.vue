<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { socket } from '../../../socket';

const emit = defineEmits(['close']);
const props = defineProps(['name','popSwitch']);
const signMethod = ref();
const signTime = ref();
const route = useRoute();
// 送給後端資料
const req = {
    uid: '',
    date: props.name.date,
    time: '',
    editTarget: ''
}
function amend() {
    if (signMethod.value === 'checkin_time') {
        req.editTarget = 'checkin_time'
    } else {
        req.editTarget = 'checkout_time'
    }
    if (req.time === '') return;
    if (req.editTarget === '') return;
    req.uid = props.name.uid;
    req.time = `${signTime.value}:00`;
    socket.emit("attendance-edit", req);
}

socket.on("attendance-edit-response", (res) => {
    //成功
    console.log(res);
    if (res.code === '0001') props.popSwitch.amendSignInOut = false
    // if (res.code === "0001") attendance.setData({ 成功, 失敗 });
});
</script>

<template>
    <div class="popUpBg flex_center">
        <div class="container">
            <header class="flex_center">
                <h1>補登簽到 / 簽退</h1>
            </header>
            <section class="flex_center">
                <div class="section1">
                    <span class="span1">姓名</span>
                    <span class="span2">{{ props.name.real_name }}</span>
                </div>
                <div class="section2">
                    <span>簽到 / 簽退</span>
                    <input v-model="signMethod" value="checkin_time" type="radio" id="checkIn" name="fav_language">
                    <label for="checkIn">簽到</label>
                    <input v-model="signMethod" value="checkout_time" type="radio" id="checkOut" name="fav_language">
                    <label for="checkOut">簽退</label><br>
                </div>
                <div class="section3">
                    <p class="star">*</p>
                    <label for="time">時間</label>
                    <input v-model="signTime" type="time" id="time">
                </div>
            </section>
            <footer class="flex_center">
                <button @click="emit('close')" class="cancelBtn">取消</button>
                <button @click="amend">新增</button>
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
    background-color: rgba(217, 217, 217, 0.5);
    ;
}

.container {
    display: flex;
    flex-direction: column;
    width: size(500);
    height: size(500);
    background-color: #FFFFFF;
    border-radius: size(4);
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
    margin-left: size(75);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
    width: 100%;
    height: 60%;

    p {
        color: #f56c6c;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
    }

    span label {
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
    }
}

.section1 {
    .span1 {
        margin-left: size(65);
    }

    .span2 {
        margin-left: size(13);
    }
}

.section3 {
    label {
        position: relative;
        margin-left: size(65);
    }

    input {
        margin-left: size(13);
    }

    .star {
        position: absolute;
        padding-left: size(55);
    }
}

input[type="radio"] {
    margin-left: size(13);
}

footer {
    width: 100%;
    height: 20%;
}

footer button {
    width: size(68);
    height: size(40);
}

.cancelBtn {
    margin-right: size(24);
    background-color: #FFFFFF;
    color: #000000;
    border: 1px solid #000000;
}
</style>