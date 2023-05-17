<script setup>
	import { computed, ref } from 'vue';
	import { socket } from '../../socket.js';
	import { useLeaveManage } from '../../stores/leaveManage';
	import LeaveDelet from './components/LeaveDelet.vue';
	import LeaveEdit from './components/LeaveEdit.vue';
	import LeaveLogin from './components/LeaveLogIn.vue';

	const { leaveSwitch, data, today, yesterday, setData } = useLeaveManage();
	const pickGroup = ref('請選擇');
	const searchName = ref('');
	const startTime = ref('');
	const endTime = ref('');
	const choseSearchDate = ref('');
	const searchDate = computed(() => {
		if (startTime.value !== '') return `${startTime.value.replace(/-/g, '/')}`;
		return '';
	});
	const editTarget = ref('');

	const req = {
		page: 1,
		pageSize: 10,
		sort: 'DESC',
		sortTarget: 'start_date',
		column: {},
	};

	function clearSearchCondition() {
		startTime.value = '';
		pickGroup.value = '請選擇';
		choseSearchDate.value = '';
		searchName.value = '';
	}

	function choseEditTarget(value) {
		editTarget.value = value;
	}

	function searchLeave() {
		if (pickGroup.value === '請選擇') req.column = {};
		if (pickGroup.value !== '請選擇') req.column.join_group = pickGroup.value;
		if (startTime.value !== '')
			req.column.checkin_time = startTime.value.replace(/\//g, '-');
		if (searchName.value != '') req.column.real_name = searchName.value;
		if (choseSearchDate.value !== '')
			req.column.checkin_time = choseSearchDate.value;
		console.log(req);
		socket.emit('absent', req);
	}
	socket.emit('absent', req);

	socket.on('absent-response', (res) => {
		console.log('absent-response: ', res);
		//成功
		if (res.code === '0001') setData(res.data);
	});
</script>

<template>
	<LeaveLogin
		@close="leaveSwitch.leaveAdd = false"
		v-if="leaveSwitch.leaveAdd" />
	<LeaveEdit
		:target="editTarget"
		@close="leaveSwitch.leaveEdit = false"
		v-if="leaveSwitch.leaveEdit" />
	<LeaveDelet
		:deleteData="editTarget"
		@close="leaveSwitch.leaveDelete = false"
		v-if="leaveSwitch.leaveDelete" />
	<div class="container">
		<div class="titleContainer">
			<h1>請假管理</h1>
		</div>
		<div class="btnContainer">
			<button @click="leaveSwitch.leaveAdd = true">+ 請假登錄</button>
		</div>
		<div class="inputContainer" action="">
			<div class="date">
				<label for="fname" id="startDate">日期</label>
				<input type="date" v-model="choseSearchDate" />
				<!-- <span>~</span> -->
				<!-- <input type="date" id="endDate" v-model="endTime"> -->
				<button @click="startTime = today()">今日</button>
				<button @click="startTime = yesterday()">昨日</button>
				<!-- <button @click="thisWeek">本週</button> -->
				<!-- <button @click="lastWeek">上週</button> -->
			</div>
			<div class="group">
				<span>組別</span>
				<select name="group" v-model="pickGroup">
					<option value="請選擇">請選擇</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>
				<span>姓名</span>
				<input type="text" v-model="searchName" />
				<button @click="searchLeave">搜尋</button>
				<button @click="clearSearchCondition">清除</button>
			</div>
		</div>
		<div class="tableContainer">
			<table style="width: 100%">
				<tr height="40">
					<th colspan="10">
						查詢區間
						<div class="searchDate">{{ searchDate }}</div>
						<!-- <div class="day" v-if="searchDateTarget !== ''">({{ searchDateTarget }})</div> -->
					</th>
				</tr>
				<tr height="40">
					<td width="5%" align="center">組別</td>
					<td width="8%" align="center">姓名</td>
					<td width="8%" align="center">起始日期</td>
					<td width="11%" align="center">起始時間</td>
					<td width="8%" align="center">結束日期</td>
					<td width="11%" align="center">結束時間</td>
					<td width="8%" align="center">請假總計</td>
					<td width="8%" align="center">請假事由</td>
					<td width="10%" align="center">備註</td>
					<td width="7%" align="center">操作</td>
				</tr>
				<tr height="40" v-for="item in data.list">
					<td align="center">{{ item.group }}</td>
					<td align="center">{{ item.name }}</td>
					<td align="center">{{ item.startDate }}</td>
					<td align="center">{{ item.startTime }}</td>
					<td align="center">{{ item?.endDate }}</td>
					<td align="center">{{ item?.endTime }}</td>
					<td align="center">{{ item.leaveTotal }}</td>
					<td align="center">{{ item.leaveReason }}</td>
					<td align="center">{{ item.attributes }}</td>
					<td align="center">
						<div
							class="edit background_setting"
							@click="choseEditTarget(item), (leaveSwitch.leaveEdit = true)" />
						<div
							class="delete background_setting"
							@click="
								choseEditTarget(item), (leaveSwitch.leaveDelete = true)
							" />
					</td>
				</tr>
			</table>
		</div>
	</div>
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
		height: size(40);
		margin-bottom: size(10);
	}

	.btnContainer button {
		width: size(140);
		height: 100%;
		font-size: 20px;
		font-weight: 700;
		line-height: 22px;
	}

	.inputContainer {
		display: flex;
		width: size(1570);
		height: size(30);
		font-size: 16px;
		font-weight: 400;
		line-height: 22px;
	}

	.date {
		height: size(30);
		margin-left: size(15);
	}

	input[type='date'] {
		margin-left: size(8);
		margin-right: size(8);
		width: size(170);
		height: size(30);
	}

	input[type='submit'] {
		border: 0;
		margin-left: size(16);
		width: size(60);
		height: size(30);
		border: 0;
		cursor: pointer;
		border-radius: size(4);
		color: #ffffff;
		background-color: #f56c6c;
	}

	input[type='text'] {
		margin-left: size(5);
		width: size(170);
		height: size(30);
	}

	.group {
		margin-left: size(75);

		button {
			margin-left: size(20);
		}
	}

	.group select {
		margin-right: size(5);
		margin-left: size(10);
		border-radius: size(4);
		width: size(107);
		height: size(32);
	}

	table,
	th,
	td {
		border: 1px solid #c5c5c5;
		border-collapse: collapse;
		font-size: size(16);
		font-weight: 500;
		line-height: 22px;
	}

	td {
		align-items: center;
	}

	th,
	td {
		align-items: center;
	}

	.tableContainer {
		// width: size(1260);
		width: 100%;
		height: size(870);
		padding-top: size(25);
	}

	.searchDate {
		display: inline-block;
		width: size(250);
		font-size: size(16);
	}

	.day {
		display: inline-block;
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

	button {
		margin-right: size(10);
		width: size(70);
		height: size(40);
	}
</style>
