<script setup>
	import { computed, ref } from 'vue';
	import FailPopUp from '../../components/FailPopUp.vue';
	import SuccessPopUp from '../../components/SuccessPopUp.vue';
	import { socket } from '../../socket';
	import { useAttendanceSearch } from '../../stores/attendanceSearch';
	import { useLeaveManage } from '../../stores/leaveManage';
	import AmendSignInOut from './components/AmendSignInOut.vue';

	const { today, yesterday, myGetDate } = useLeaveManage();
	const { attendanceSwitch, data, setData } = useAttendanceSearch();
	const amendSignUpOutName = ref();
	const pickGroup = ref('請選擇');
	const searchName = ref('');
	const startTime = ref('');
	const endTime = ref('');
	const choseSearchDate = ref('');
	// console.log(dateTool.myGetDate);
	const searchDate = computed(() => {
		// if (startTime.value !== '') return `${startTime.value.replace(/-/g, '/')} ~ ${endTime.value.replace(/-/g, '/')}`;
		if (startTime.value !== '') {
			return `${startTime.value.replace(/-/g, '/')}`;
		} else if (choseSearchDate.value !== '') {
			return choseSearchDate.value.replace(/-/g, '/');
		}
		return '';
	});
	const searchDateTarget = ref('');

	/**
	 * { req.column }條件式搜尋，有待條件就帶入key值
	 */
	const req = {
		page: 1,
		pageSize: 10,
		sort: 'DESC',
		sortTarget: 'checkin_time',
		column: {},
	};
	function search() {
		if (pickGroup.value === '請選擇') req.column = {};
		if (pickGroup.value !== '請選擇') req.column.join_group = pickGroup.value;
		if (startTime.value !== '')
			req.column.checkin_time = startTime.value.replace(/\//g, '-');
		if (searchName.value != '') req.column.real_name = searchName.value;
		if (choseSearchDate.value !== '')
			req.column.checkin_time = choseSearchDate.value;
		console.log(req);
		socket.emit('attendance', req);
	}
	socket.on('attendance-response', (res) => {
		console.log('#attendance-response: ', res);
		//成功
		if (res.code === '0001') {
			const dataRevise = res.data.list.map((v) => {
				v.checkin_time = v.checkin_time.replace(/[TZ]|\.000Z/g, ' ');
				v.checkout_time = v.checkout_time.replace(/[TZ]|\.000Z/g, ' ');
				return {
					...v,
				};
			});
			console.log('|123333|', dataRevise);
			setData({ total: res.data.total, list: res.data.list });
		}
	});

	function popUpSwitch(val) {
		amendSignUpOutName.value = val;
		attendanceSwitch.amendSignInOut = !attendanceSwitch.amendSignInOut;
	}

	function clearSearchCondition() {
		startTime.value = '';
		pickGroup.value = '請選擇';
		choseSearchDate.value = '';
	}
</script>

<template>
	<AmendSignInOut
		:name="amendSignUpOutName"
		:popSwitch="attendanceSwitch"
		@close="popUpSwitch"
		v-if="attendanceSwitch.amendSignInOut" />
	<SuccessPopUp v-if="attendanceSwitch.successPopUp" />
	<FailPopUp v-if="attendanceSwitch.failPopUp" />
	<div class="container">
		<div class="titleContainer">
			<h1>打卡紀錄</h1>
		</div>
		<div class="inputContainer" action="">
			<div class="date">
				<label for="startDate">日期</label>
				<input type="date" id="startDate" v-model="choseSearchDate" />
				<!-- <span>~</span> -->
				<!-- <input type="date" id="endDate"> -->
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
				<button @click="search">搜尋</button>
				<button @click="clearSearchCondition">清除</button>
			</div>
		</div>
		<div class="tableContainer">
			<table style="width: 100%">
				<tr height="40">
					<th colspan="7">
						查詢區間
						<div class="searchDate">{{ searchDate }}</div>
						<div class="day" v-if="searchDateTarget !== ''">
							({{ searchDateTarget }})
						</div>
					</th>
				</tr>
				<tr height="40">
					<td width="5%" align="center">組別</td>
					<td width="8%" align="center">姓名</td>
					<td width="8%" align="center">日期</td>
					<td width="13%" align="center">簽到時間</td>
					<td width="13%" align="center">簽退時間</td>
					<td width="13%" align="center">備註</td>
					<td width="8%" align="center">補登簽到/退</td>
				</tr>
				<tr height="40" v-for="item in data.list" key="item">
					<td align="center">{{ item.join_group }}</td>
					<td align="center">{{ item.real_name }}</td>
					<td align="center">{{ item.date }}</td>
					<td align="center">{{ item.checkin_time }}</td>
					<td align="center">{{ item.checkout_time }}</td>
					<td align="center">{{ item.attributes }}</td>
					<td align="center">
						<div
							@click="popUpSwitch(item)"
							class="edit background_setting"></div>
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

		button {
			margin-left: size(11);
			width: size(60);
			height: size(30);
		}
	}

	input[type='date'] {
		margin-left: size(8);
		margin-right: size(8);
		width: size(200);
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
			margin-left: size(16);
			width: size(60);
			height: size(30);
		}

		select {
			margin: 0 size(20);
			border-radius: size(4);
			width: size(107);
			height: size(32);
		}
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

	.edit {
		width: size(17.7);
		height: size(17.7);
		background-image: url(../../assets/img/penImg.png),
			url('../../assets/img/editBottomLine.png');
		background-position: left top, right bottom;
		background-size: 100%, 50% 1px;
		cursor: pointer;
	}

	.searchDate {
		display: inline-block;
		width: size(250);
		font-size: size(16);
	}
</style>
