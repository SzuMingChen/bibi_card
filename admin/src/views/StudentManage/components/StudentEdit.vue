<script setup>
	import { ref } from 'vue';
	import { socket } from '../../../socket';
	import { useAccountData } from '../../../stores/studentManage';
	import LockCard from './LockCard.vue';

	//! 啟用Pinia的變數
	const { data } = useAccountData();
	const editData = { ...data.editTarget };
	const emit = defineEmits(['close']);
	const studentSwitchLockCard = ref(false);
	const inputReminder = {
		name: '',
		phone: '',
	};
	function lockCardSwitch() {
		studentSwitchLockCard.value = !studentSwitchLockCard.value;
	}
	//TODO
	function confirmEdit() {
		console.log('學員管理編輯', editData);
		//!!!! 特別注意的是uid 不能編輯 但要攜帶過去
		//! 需判斷 表單 裡面的哪些欄位有修正
		if (editData.name === '') return (inputReminder.name = '＊ 必填欄位');
		if (editData.phoneNumber === '')
			return (inputReminder.phone = '＊必填欄位');
		// step 學員管理編輯
		socket.emit('student-edit', editData);
		inputReminder.value = {
			name: '',
			phone: '',
		};
	}
</script>

<template>
	<div class="popUpBg flex_center">
		<div class="container">
			<header class="flex_center">
				<h1>編輯學員</h1>
			</header>
			<section class="flex_center">
				<div>
					<span class="starSpan1">*</span>
					<label for="account">帳號 : {{ editData.uid }}</label>
					<!-- <input type="text" id="account" v-model="data.editTarget.uid"> -->
					<!-- <span class="lilSpan1">*必填欄位</span> -->
				</div>
				<div>
					<span class="starSpan2">*</span>
					<label for="name">姓名</label>
					<input type="text" id="name" v-model="editData.name" />
					<span class="lilSpan2">{{ inputReminder.name }}</span>
				</div>
				<div>
					<span class="starSpan3">*</span>
					<label for="phone">電話</label>
					<!--TODO 電話需要擋正則 -->
					<input type="text" id="phone" v-model="editData.phoneNumber" />
					<span class="lilSpan3">{{ inputReminder.phone }}</span>
				</div>
				<div>
					<label for="email">信箱</label>
					<input type="email" id="email" v-model="editData.email" />
				</div>
				<div>
					<label>組別</label>
					<select name="group" v-model="editData.group">
						<option value="請選擇">請選擇</option>
						<option value="1">第一組</option>
						<option value="2">第二組</option>
						<option value="3">第三組</option>
					</select>
				</div>
				<div>
					<label for="card">卡號</label>
					<input type="text" id="card" v-model="editData.cardNumber" />
					<button @click="lockCardSwitch">綁定卡片</button>
				</div>
			</section>
			<footer class="flex_center">
				<button class="cancelBtn" @click="emit('close', false)">取消</button>
				<button @click="confirmEdit">確認</button>
			</footer>
		</div>
	</div>
	<LockCard
		:inputValue="{ cardCheckA: data.cardCheckA, cardCheckB: data.cardCheckB }"
		@check="(data.cardCheckA = ''), (data.cardCheckB = '')"
		v-if="studentSwitchLockCard"
		@close="studentSwitchLockCard = false" />
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
