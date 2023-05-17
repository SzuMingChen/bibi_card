<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="container">
        <img class="ketchup img_setting" src="../../assets/img/ketchup.png" alt="番茄罐">
        <RouterLink to="/attendanceSearch" class="tomatoContainer">
            <img class="tomato" src="../../assets/img/tomato.png" alt="小番茄">
            <span>打卡紀錄</span>
        </RouterLink>
        <RouterLink to="/studentManage" class="tomatoContainer">
            <img src="../../assets/img/tomato.png" alt="小番茄">
            <span>學員管理</span>
        </RouterLink>
        <RouterLink to="/leaveManage" class="tomatoContainer">
            <img src="../../assets/img/tomato.png" alt="小番茄">
            <span>請假管理</span>
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: size(350);
    height: size(1080);
    background-color: #FFE1E1;
}
.ketchup{
    width: size(300);
    height: size(166);
    margin-top: size(20);
    margin-bottom: size(47);
}
.tomatoContainer{
    margin-bottom: size(18);
    display: flex;
    align-items: center;
    width: size(295);
    height: size(47);
}
.tomatoContainer img{
    width: size(50);
    height: size(47);
}
.tomatoContainer span{
    margin-left: size(23);
    font-weight: 500;
    font-size: 24px;
    line-height: 22px;
}
</style>