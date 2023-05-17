import { defineStore } from 'pinia';
import { ref } from 'vue';
import { socket } from '../socket';

export const useAccountData = defineStore('student', () => {
  const data = ref({
    editTarget: {},
    list: [],
    cardCheckA: "",
    cardCheckB: "",
  })
  const studentSwitch = ref({
    register: false,
    edit: false,
    delete: false,
    successPopUp: false,
    failPopUp: false,
  })
  const setData = ({
    list = []
  }) => {
    data.value.list = list;
  }
  const cleanEditTarget = () => {
    console.log("改ＡＡＡＡＡ", data.value.editTarget);
    data.value.editTarget = {}
    console.log("改ＢＢＢＢＢ", data.value.editTarget);
    data.value.cardCheckA = '';
    data.value.cardCheckB = '';
  }
  const getStudentList = () => {
    socket.emit("student", (res) => {
      console.log(res);
    });
  }
  const count = ref(0)
  const lockCardAction = () => {
    // step 獲取卡片
    socket.on("get-card-id", (msg) => {
      count.value++
      console.log(count.value);
      if (msg.code !== "0001") return studentSwitch.failPopUp = true;

      const { card_id } = msg.data;
      // console.log("|card_id| ", card_id);

      if (data.value.cardCheckA === "") {
        data.value.cardCheckA = card_id;
      } else if (data.value.cardCheckA !== "") {
        data.value.cardCheckB = card_id;
      }
    });

  }
  return {
    data,
    setData,
    getStudentList,
    cleanEditTarget,
    studentSwitch,
    lockCardAction
  }
})

// step 學員管理搜尋
//structure 讓監聽在 固定的資料區內持續監聽 
//! 若需要再次更新資料只需執行 getStudentList() 即可
//structure 功能則寫在 defineStore 在不同頁面觸發emit請求
socket.on("student-response", response => {
  console.log("student-response", response);
  if (response.code === "0001") {
    useAccountData().setData({ list: response.data });
  } else {
    console.log(response);
  }
});

// step 學員管理編輯
//TODO
//TODO 可以在資料頁，設定變數做為視窗的開關判斷
socket.on("student-edit-response", response => {
  console.log("student-edit-response", response);
  //# 彈窗判斷
  if (response.code === "0001") {
    console.log("編輯成功彈窗");
    useAccountData().studentSwitch.edit = false
    //! 清空editTarget
    useAccountData().cleanEditTarget();
    //! 刷新資料
    useAccountData().getStudentList();
  } else {
    console.log("編輯失敗彈窗");
  }
});


// step 學員管理刪除
//TODO
//TODO 可以在資料頁，設定變數做為視窗的開關判斷
socket.on("student-drop-response", response => {
  console.log("student-drop-response", response);
  //# 彈窗判斷
  if (response.code === "0001") {
    console.log("編輯成功彈窗");
    useAccountData().studentSwitch.delete = false
    console.log(useAccountData().studentSwitch);
    //! 清空editTarget
    useAccountData().cleanEditTarget();
    //! 刷新資料
    useAccountData().getStudentList();
  } else {
    console.log("編輯失敗彈窗");
  }
});
// step 學員管理新增
//TODO
//TODO 可以在資料頁，設定變數做為視窗的開關判斷
socket.on("student-add-response", response => {
  console.log("student-add-response", response);
  console.log("學員管理新增", response);

  //# 彈窗判斷
  if (response.code === "0001") {
    console.log("學員管理新增成功", response);
    useAccountData().studentSwitch.register = false
    //! 清空editTarget
    useAccountData().cleanEditTarget();
    //! 刷新資料
    useAccountData().getStudentList();
  } else {
    console.log("編輯失敗彈窗");
  }
});