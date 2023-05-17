<script setup>
	import { ref } from 'vue';
	import { socket } from '../../../socket.js';
	import { useLogin } from '../../../stores/login';
	import { useAccountData } from '../../../stores/studentManage';
	import LockCard from './LockCard.vue';

	//! 啟用Pinia的變數
	const { data, cleanEditTarget, studentSwitch } = useAccountData();
	const loginPinia = useLogin();
	const emit = defineEmits(['close']);
	const studentSwitchLockCard = ref(false);
	const inputReminder = ref({
		uid: '',
		name: '',
		phone: '',
	});
	const registerData = ref({
		uid: '',
		name: '',
		phoneNumber: '',
		email: '',
		group: '',
		cardNumber: '',
		admin_uid: '',
	});

	function lockCardSwitch() {
		// 綁定卡片彈窗
		studentSwitchLockCard.value = !studentSwitchLockCard.value;
	}
	function registerStudentBtn() {
		// 送出註冊資料
		registerData.value.admin_uid = loginPinia.admin_uid;
		console.log('註冊學員', registerData.value);
		if (registerData.value.uid === '')
			return (inputReminder.value.uid = '* 必填欄位');
		if (registerData.value.name === '')
			return (inputReminder.value.name = '* 必填欄位');
		if (registerData.value.phoneNumber === '')
			return (inputReminder.value.phone = '* 必填欄位');
		socket.emit('student-add', registerData.value);
		inputReminder.value = {
			uid: '',
			name: '',
			phone: '',
		};
	}
	function lockCardResult() {
		registerData.cardNumber = data.cardCheckA;
		data.cardCheckA = '';
		data.cardCheckB = '';
	}
</script>

<template>
	<div class="popUpBg flex_center">
		<div class="container">
			<header class="flex_center">
				<h1>註冊學員</h1>
			</header>
			<section class="flex_center">
				<div>
					<span class="starSpan1">*</span>
					<label for="account">帳號</label>
					<input v-model="registerData.uid" type="text" id="account" />
					<span class="lilSpan1">{{ inputReminder.uid }}</span>
				</div>
				<div>
					<span class="starSpan2">*</span>
					<label for="name">姓名</label>
					<input v-model="registerData.name" type="text" id="name" />
					<span class="lilSpan2">{{ inputReminder.name }}</span>
				</div>
				<div>
					<span class="starSpan3">*</span>
					<label for="phone">電話</label>
					<input v-model="registerData.phoneNumber" type="text" id="phone" />
					<span class="lilSpan3">{{ inputReminder.phone }}</span>
				</div>
				<div>
					<label for="email">信箱</label>
					<input v-model="registerData.email" type="email" id="email" />
				</div>
				<div>
					<label>組別</label>
					<select v-model="registerData.group" name="group">
						<option value="請選擇">請選擇</option>
						<option value="1">第一組</option>
						<option value="2">第二組</option>
						<option value="3">第三組</option>
					</select>
				</div>
				<div>
					<label for="card">卡號</label>
					<input v-model="registerData.cardNumber" type="text" id="card" />
					<button @click="lockCardSwitch()">綁定卡片</button>
				</div>
			</section>
			<footer class="flex_center">
				<button class="cancelBtn" @click="emit('close')">取消</button>
				<button @click="registerStudentBtn(), cleanEditTarget()">新增</button>
			</footer>
		</div>
	</div>
	<LockCard
		:inputValue="{ cardCheckA: data.cardCheckA, cardCheckB: data.cardCheckB }"
		@check="lockCardResult"
		v-if="studentSwitchLockCard"
		@close="lockCardSwitch" />
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
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		width: size(600);
		height: size(650);
		background-color: #ffffff;
		border-radius: size(4);
	}
	header {
		width: 100%;
		height: 20%;
		h1 {
			font-weight: 700;
			font-size: 18px;
			line-height: 22px;
		}
	}
	section {
		padding-left: size(125);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		height: 60%;
	}
	section span {
		color: #f56c6c;
		font-weight: 400;
		font-size: 12px;
		line-height: 18px;
	}
	section label {
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
	}
	section input {
		position: relative;
		margin-left: size(12);
		width: size(276);
		height: size(40);
		border-radius: size(4);
		border: 1px solid rgba(228, 231, 237, 1);
	}
	.starSpan1 {
		position: absolute;
		top: size(130);
		left: size(115);
	}
	.starSpan2 {
		position: absolute;
		top: size(200);
		left: size(115);
	}
	.starSpan3 {
		position: absolute;
		top: size(270);
		left: size(115);
	}
	.lilSpan1 {
		position: absolute;
		top: size(175);
		left: size(185);
	}
	.lilSpan2 {
		position: absolute;
		top: size(245);
		left: size(185);
	}
	.lilSpan3 {
		position: absolute;
		top: size(315);
		left: size(185);
	}
	section select {
		margin-left: size(12);
		width: size(107);
		height: size(32);
		border-radius: size(4);
		border: 1px solid rgba(228, 231, 237, 1);
	}
	section button {
		margin-left: size(25);
		width: size(96);
		height: size(40);
		background-color: #ffffff;
		color: #000000;
		border: 1px solid #000000;
	}

	footer {
		width: 100%;
		height: 20%;
		button {
			width: size(68);
			height: size(40);
		}
	}
	.cancelBtn {
		margin-right: size(24);
		background-color: #ffffff;
		color: #000000;
		border: 1px solid #000000;
	}
</style>
