<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import AsideBar from "./components/AsideBar.vue";
import HeaderNav from "./components/HeaderNav.vue";
import NotificationPopUp from "./components/NotificationPopUp.vue";
let aa = ref([1,2,3])
setTimeout(()=>{ aa.value.shift()},2000);
setTimeout(()=>{ aa.value.push(65)},4000);


</script>

<template>
 
    <div class="container">
        <div class="notification"> 
        <NotificationPopUp />
        </div>
        <div class="head">
            <HeaderNav />
        </div>
        <div class="aside">
            <AsideBar />
        </div>
        <div class="section">
            <hr>
            <RouterView />            
        </div>

    </div>
  
</template>

<style lang="scss" scoped>
.container{
    position: relative;
    width: 100%;
    height: 100%;
}
.notification{
    position: relative;
    direction: rtl;
    top: size(90);
    left: size(0);
}
.aside{
    position: absolute;
    top: size(0);
    left: size(0);
    width: size(350);
    height: size(1080);
}
.head{
    position: absolute;
    top: size(0);
    left: size(350);
    width: size(1570);
    height: size(80);    
}
.section{
    position: absolute;
    top: size(80);
    left: size(350);
    width: size(1570);
    height: size(990);      
}
</style>