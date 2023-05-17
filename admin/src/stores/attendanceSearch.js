import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAttendanceSearch = defineStore('attendance', () => {
  const data = ref(
    {
      total: 1,
      list: []
    }
  );
  const attendanceSwitch = ref({
    amendSignInOut: false,
    successPopUp: false,
    failPopUp: false,
  });
  const setData = (
    {
      total = 0,
      list = []
    } = {}
  ) => {
    data.value.total = total;
    data.value.list = list;
  }
  return {
    attendanceSwitch,
    data,
    setData
  }
})