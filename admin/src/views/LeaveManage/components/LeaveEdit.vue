<script setup>
	import { socket } from '@/socket';
	import { ref } from 'vue';

	const props = defineProps(['target']);
	const emit = defineEmits(['close']);

	const leaveReason = ['事假', '病假'];
	const choseAddData = ref({
		startDate: props.target.startDate,
		startTime: props.target.startTime,
		endDate: props.target.endDate,
		endTime: props.target.endTime,
		reason: props.target.leaveReason,
		attributes: props.target.attributes,
	});
	function leaveEdit() {
		socket.emit('absent-edit', {
			start_date: choseAddData.value.startDate,
			start_time: choseAddData.value.startTime,
			end_date: choseAddData.value.endDate,
			end_time: choseAddData.value.endTime,
			reason: choseAddData.value.reason,
			attributes: choseAddData.value.attributes,
			uid: props?.target.uid,
			id: props?.target.id,
		});
		socket.on('absent-edit-response', (res) => {
			console.log('absent res ', res);
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
		});
	}
</script>

<template>
	<div class="popUpBg flex_center">
		<div class="container">
			<header class="flex_center">
				<h1>請假編輯</h1>
			</header>
			<section class="flex_center">
				<ul>
					<li>
						<span class="required">＊</span>組別
						<span class="remark"> {{ props.target.group }} </span>
					</li>
					<li>
						<span class="required">＊</span>姓名
						<span class="remark">{{ props.target.name }}</span>
					</li>
					<li class="choseTime">
						<div class="startTime flex_center">
							<span class="required">＊</span>起始日期
							<input type="date" v-model="choseAddData.startDate" />
							<span class="required position">＊必填欄位</span>
						</div>
						<div class="endTime flex_center">
							<span class="required">＊</span>起始時間
							<input type="time" v-model="choseAddData.startTime" />
							<span class="required position">＊必填欄位</span>
						</div>
					</li>
					<li class="choseTime">
						<div class="startTime flex_center">
							<span class="required">＊</span>結束日期
							<input type="date" v-model="choseAddData.endDate" />
							<span class="required position">＊必填欄位</span>
						</div>
						<div class="endTime flex_center">
							<span class="required">＊</span>結束時間
							<input type="time" v-model="choseAddData.endTime" />
							<span class="required position">＊必填欄位</span>
						</div>
					</li>
					<li>
						<span class="required">＊</span>請假事由
						<select name="group" v-model="choseAddData.reason">
							<option :value="item" v-for="item in leaveReason">
								{{ item }}
							</option>
						</select>
						<span class="required noticeMsg">＊必填欄位</span>
					</li>
					<li>
						<span>備註</span>
						<input type="text" v-model="choseAddData.attributes" />
					</li>
				</ul>
			</section>
			<footer class="flex_center">
				<button class="delete" @click="emit('close')">取消</button>
				<button @click="leaveEdit">確認</button>
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

	.delete {
		margin-right: size(55);
		background-color: #ffffff;
		border: 1px solid #000000;
		border-radius: 4px;
		color: #000000;
	}

	.remark {
		font-size: size(18);
		font-weight: 700;
		margin-left: size(17);
	}
</style>
