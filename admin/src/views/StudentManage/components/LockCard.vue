<script setup>
import { computed, ref } from 'vue';
import {useAccountData} from '../../../stores/studentManage';
const emit = defineEmits(['close','check']);

//! 啟用Pinia的變數
const {data, lockCardAction} = useAccountData();
lockCardAction()
const props = defineProps(['inputValue']);
const inputText = computed(()=>{
  console.log(data);
if (props.inputValue !== "") {
  return data.cardCheckB;
}
return props.inputValue;
});

const showText = computed(()=>{
if (props.inputValue.cardCheckA !== "") {
  return "請再次感應卡片";
}
return "請感應卡片";
});

const check = ()=>{
  if (props.inputValue.cardCheckA !== props.inputValue.cardCheckB) {
    console.error("感應馬不同");
  }
  data.editTarget.cardNumber = props.inputValue;
  console.log("一樣",data.editTarget);
  props.inputValue.cardCheckA = "";
  props.inputValue.cardCheckB = "";
  emit('close', false);
}

</script>

<template>
  <div class="popUpBg flex_center">
    <div class="container">
      <header class="flex_center">
        <h1>綁定卡片</h1>
      </header>
      <section class="flex_center">  
        <span>{{ showText }}</span>
        <input type="text" v-model="inputText">
      </section>
      <footer class="flex_center">
          <button class="cancleBtn" @click="emit('close', false),emit('check')">取消</button>
          <button @click="check(),emit('check')">確認</button>
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
  padding-top: size(30);
  width: 100%;
  height: 20%;
}
.header h1{
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;    
}
section{
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60%;
}
section span{
  position: absolute;
  top: size(40);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}
section input{
  position: absolute;
  top: size(90);
  width: size(323);
  height: size(30);
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