<script setup>
	import FailPopUp from '../../components/FailPopUp.vue';
	import SuccessPopUp from '../../components/SuccessPopUp.vue';
	import { useAccountData } from '../../stores/studentManage';
	import StudentDelete from './components/StudentDelete.vue';
	import StudentEdit from './components/StudentEdit.vue';
	import StudentRegister from './components/StudentRegister.vue';

	//! 啟用Pinia的變數
	const { data, getStudentList, setData, studentSwitch } = useAccountData();

	//# 進入頁面時刷新資料
	getStudentList();
	function choseEditTarget(value) {
		data.editTarget = value;
		console.log('choseEditTarget@@@@@@@', data.editTarget);
	}
</script>

<template>
	<div class="container">
		<div class="titleContainer">
			<h1>學員管理</h1>
		</div>
		<div class="btnContainer">
			<button @click="studentSwitch.register = true">+註冊學員</button>
		</div>
		<div class="tableContainer">
			<table style="width: 100%">
				<tr height="40">
					<td width="16.5%" align="center">組別</td>
					<td width="16.5%" align="center">姓名</td>
					<td width="16.5%" align="center">電話</td>
					<td width="16.5%" align="center">信箱</td>
					<td width="16.5%" align="center">卡片號碼</td>
					<td width="16.5%" align="center">操作</td>
				</tr>
				<tr height="40" v-for="item in data.list">
					<td width="16.5%" align="center">{{ item.group }}</td>
					<td width="16.5%" align="center">{{ item.name }}</td>
					<td width="16.5%" align="center">{{ item.phoneNumber }}</td>
					<td width="16.5%" align="center">{{ item.email }}</td>
					<td width="16.5%" align="center">{{ item.cardNumber }}</td>
					<td width="16.5%" align="center">
						<div
							class="edit background_setting"
							@click="choseEditTarget(item), (studentSwitch.edit = true)" />
						<div
							class="delete background_setting"
							@click="choseEditTarget(item), (studentSwitch.delete = true)" />
					</td>
				</tr>
			</table>
		</div>
	</div>
	<StudentRegister
		v-if="studentSwitch.register"
		@close="studentSwitch.register = false" />
	<StudentEdit v-if="studentSwitch.edit" @close="studentSwitch.edit = false" />
	<StudentDelete
		v-if="studentSwitch.delete"
		@close="studentSwitch.delete = false" />
	<SuccessPopUp v-if="studentSwitch.successPopUp" />
	<FailPopUp v-if="studentSwitch.failPopUp" />
</template>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		padding-left: size(35);
		width: size(1570);
		height: size(990);
	}
	.titleContainer {
		display: flex;
		align-items: center;
		width: size(1260);
		height: size(90);
	}
	.titleContainer h1 {
		font-size: 36px;
		font-weight: 700;
		line-height: 22px;
	}
	.btnContainer {
		width: size(1260);
		height: size(62);
	}
	.btnContainer button {
		width: size(210);
		height: 100%;
		font-size: 20px;
		font-weight: 700;
		line-height: 22px;
	}
	table,
	th,
	td {
		border: 1px solid #c5c5c5;
		border-collapse: collapse;
		font-size: 16px;
		font-weight: 500;
		line-height: 22px;
	}
	.tableContainer {
		width: size(1260);
		height: size(870);
		padding-top: size(25);
		overflow: scroll;
	}
	.edit {
		display: inline-block;
		background-image: url(../../assets/img/penImg.png),
			url(../../assets/img/editBottomLine.png);
		background-position: left top, right bottom;
		background-size: 100%, 50% 1px;
		width: size(17.7);
		height: size(17.7);
		margin-right: size(30);
		cursor: pointer;
	}

	.delete {
		display: inline-block;
		background-image: url(../../assets/img/trashcanImg.png);
		width: size(17.7);
		height: size(17.7);
	}
</style>
