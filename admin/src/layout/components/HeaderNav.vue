<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { socket } from '../../socket.js';
const router = useRouter();
let date = ref(new Date().toLocaleString());

setInterval(()=>{
    date.value = new Date().toLocaleString();
},1000)

const logoutBTN = ()=>{
    console.log("登出摟");
      router.push('/')
} 

</script>

<template>
    <div class="container">
        <span>
            {{ date }}
        </span>
        <button @click="logoutBTN">登出</button>
    </div>
</template>

<style lang="scss" scoped>
.container{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: size(1570);
    height: size(80);
}
.container span{
    margin-right: size(27);   
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
}
.container button{
    margin-right: size(24);
    width: size(68);
    height: size(40);    
}
</style>