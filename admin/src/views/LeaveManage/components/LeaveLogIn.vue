<script setup>
	import { computed, ref } from 'vue';
	import { socket } from '../../../socket.js';
	import { useAccountData } from '../../../stores/studentManage';
	const studentManage = useAccountData();
	const emit = defineEmits(['close']);
	const choseAddData = ref({
		group: '請選擇',
		uid: '',
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		reason: '請選擇',
		attributes: '',
	});
	const data = ref({
		group: [],
		studentDetail: [],
		leaveReason: ['請選擇', '事假', '病假'],
	});
	const inputReminder = {
		uid: '',
		reason: '',
		group: '',
		start_date: '',
		start_time: '',
		end_date: '',
		end_time: '',
	};
	const nameList = computed(() => {
		if (choseAddData.value.group !== '請選擇')
			return data.value.studentDetail.filter((v) => {
				console.log('v', v);
				console.log('choseAddData', choseAddData.value);
				return v.group === choseAddData.value.group;
			});
		return data.value.studentDetail;
	});
	socket.emit('student', (res) => {
		console.log(res);
	});
	socket.on('student-response', (res) => {
		console.log(res);
		if (res.code === '0001') {
			const group = res.data.map((i) => i.group);
			data.value.group = new Set(group);
			data.value.studentDetail = res.data;
		}
	});

	function addLeave() {
		const req = {
			uid: choseAddData.value.uid,
			reason: choseAddData.value.reason,
			start_date: choseAddData.value.startDate,
			start_time: choseAddData.value.startTime,
			end_date: choseAddData.value.endDate,
			end_time: choseAddData.value.endTime,
			attributes: choseAddData.value.attributes,
		};
		if (res.group === '') return;
		if (req.reason === '') return (inputReminder.reason = '＊ 必填欄位');
		if (req.uid === '') return;
		if (req.start_date === '')
			return (inputReminder.start_date = '＊ 必填欄位');
		if (req.start_time === '')
			return (inputReminder.start_time = '＊ 必填欄位');
		if (req.end_date === '') return (inputReminder.end_date = '＊ 必填欄位');
		if (req.end_time === '') return (inputReminder.end_time = '＊ 必填欄位');

		socket.emit('absent-add', req);
		socket.on('absent-add-response', (res) => {
			console.log(res);
			if (res.code === '0001') {
				socket.emit('absent', {
					page: 1,
					pageSize: 10,
					sort: 'DESC',
					sortTarget: 'start_date',
					column: {},
				});
				emit('close');
			}
			studentManage.studentSwitch.filter = true;
		});
	}
</script>

<template>
	<div class="popUpBg flex_center">
		<div class="container">
			<header class="flex_center">
				<h1>請假登錄</h1>
			</header>
			<section class="flex_center">
				<ul>
					<li>
						<span class="required">＊</span>組別
						<select name="group" v-model="choseAddData.group">
							<option :value="item" v-for="item in data.group">
								{{ item }}
							</option>
						</select>
						<span class="required noticeMsg">{{ inputReminder.group }}</span>
					</li>
					<li>
						<span class="required">＊</span>姓名
						<select name="group" v-model="choseAddData.uid">
							<option :value="item.uid" v-for="item in nameList">
								{{ item.name }}
							</option>
						</select>
						<span class="required noticeMsg">{{ inputReminder.name }}</span>
					</li>
					<li class="choseTime">
						<div class="startTime flex_center">
							<span class="required">＊</span>起始日期
							<input type="date" v-model="choseAddData.startDate" />
							<span class="required position">{{
								inputReminder.start_date
							}}</span>
						</div>
						<div class="endTime flex_center">
							<span class="required">＊</span>起始時間
							<input type="time" v-model="choseAddData.startTime" />
							<span class="required position">{{
								inputReminder.start_time
							}}</span>
						</div>
					</li>
					<li class="choseTime">
						<div class="startTime flex_center">
							<span class="required">＊</span>結束日期
							<input type="date" v-model="choseAddData.endDate" />
							<span class="required position">{{
								inputReminder.end_date
							}}</span>
						</div>
						<div class="endTime flex_center">
							<span class="required">＊</span>結束時間
							<input type="time" v-model="choseAddData.endTime" />
							<span class="required position">{{
								inputReminder.end_time
							}}</span>
						</div>
					</li>
					<li>
						<span class="required">＊</span>請假事由
						<select name="group" v-model="choseAddData.reason">
							<option :value="item" v-for="item in data.leaveReason">
								{{ item }}
							</option>
						</select>
						<span class="required noticeMsg">{{ inputReminder.reason }}</span>
					</li>
					<li>
						<span>備註</span>
						<input type="text" v-model="choseAddData.attributes" />
					</li>
				</ul>
			</section>
			<footer class="flex_center">
				<button class="close" @click="emit('close')">取消</button>
				<button @click="addLeave">新增</button>
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
	}

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		width: size(600);
		height: size(700);
		background-color: #ffffff;
		border-radius: size(4);
		font-size: size(16);
	}

	header {
		width: 100%;
		height: 20%;
	}

	section {
		width: 100%;
		height: 60%;
	}

	ul {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;

		li {
			display: flex;
			align-items: center;
			height: size(70);
			width: 100%;
			position: relative;

			.required {
				color: red;
				font-size: size(12);
			}

			.noticeMsg {
				position: absolute;
				bottom: size(0);
				left: size(100);
			}
		}

		li:nth-child(1),
		li:nth-child(2) {
			padding-left: size(50);
		}

		li:nth-child(5) {
			padding-left: size(20);
		}

		li:nth-child(6) {
			padding-left: size(63);

			input {
				height: size(40);
			}
		}

		.choseTime {
			display: flex;
			padding-left: size(20);

			.startTime {
				position: relative;

				.position {
					position: absolute;
					bottom: size(-20);
					left: size(80);
					// color: black;
				}
			}

			.endTime {
				position: relative;

				.position {
					position: absolute;
					bottom: size(-20);
					left: size(80);
				}
			}
		}
	}

	input {
		padding: 2px;
		border: 1px solid #e4e7ed;
		border-radius: 4px;
		margin-right: size(10);
		margin-left: size(10);

		span {
			margin-left: size(10);
		}
	}

	select {
		font-size: size(16);
		margin-left: size(10);
		padding: 2px;
		border: 1px solid #e4e7ed;
		border-radius: 4px;
	}

	footer {
		width: 100%;
		height: 20%;
	}

	button {
		padding: size(9) size(20);
	}

	.close {
		margin-right: size(55);
		background-color: #ffffff;
		border: 1px solid #000000;
		border-radius: 4px;
		color: #000000;
	}
</style>
