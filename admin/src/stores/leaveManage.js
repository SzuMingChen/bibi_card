import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLeaveManage = defineStore('leave', () => {
  const leaveSwitch = ref({
    leaveAdd: false,
    leaveEdit: false,
    leaveDelete: false,
  });
  const data = ref(
    {
      total: 1,
      list: []
    }
  );
  const date = new Date();
  const time = date.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  // const searchDateTarget = ref('');

  // 日期格式轉換
  function myGetDate(value) {
    const dateArr = value.toLocaleDateString().split('/');
    dateArr[1] = dateArr[1].padStart(2, '0');
    dateArr[2] = dateArr[2].padStart(2, '0');
    // console.log(`${dateArr[0]}-${dateArr[1]}-${dateArr[2]}`);
    return `${dateArr[0]}-${dateArr[1]}-${dateArr[2]}`;
  }
  // 昨日
  function yesterday() {
    const before = new Date(time - oneDay);
    // searchDateTarget.value = '昨日';
    return myGetDate(before);
    // endTime.value = leave.myGetDate(before);
  }
  // 今日
  function today() {
    // searchDateTarget.value = '今日';
    return myGetDate(date);
    // endTime = myGetDate(date);
  }
  // 上週
  function lastWeek() {
    const mondayTime = new Date(time - (day + 6) * oneDay);
    const sundayTime = new Date(time - day * oneDay);
    // searchDateTarget.value = '上週';
    startTime.value = myGetDate(mondayTime);
    endTime.value = myGetDate(sundayTime);
  }
  // 本週
  function thisWeek() {
    const mondayTime = new Date(date.setTime(time - (day - 1) * oneDay));
    // searchDateTarget.value = '本週';
    startTime.value = myGetDate(mondayTime);
    endTime.value = myGetDate(new Date());
  }
  // 設定資料
  const setData = (list = []) => {
    // data.value.total = total;
    data.value.list = list;
  }
  return {
    leaveSwitch,
    lastWeek,
    data,
    setData,
    // searchDateTarget,
    thisWeek,
    today,
    myGetDate,
    yesterday
  }
})