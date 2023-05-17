//# Process
/**
 * 佇列需使用
 * task = { uid, target }
 * @param {Function} createMQ 創建相對應的佇列
 * @param {Function} addTask 新增任務至對應佇列
 * @param {Function} closeMQ 關閉相對應的佇列
 * @param {Function} isTaskAvailable 檢測是否對應佇列已啟用
 * @param {Function} getPersonalProcessList 獲取相對應的佇列
 * @param {Function} startMQ 開始執行該佇列(需要先 getPersonalProcessList)
 */
class MessageQueue {
  #processing = new Map();
  processList = new Map();
  constructor(type) {
    this.typeofMQ = type;
  }


  /**
   * 檢測是否對應佇列已啟用
   * @param {Object} task 任務(執行項目的基本資料)
   * @returns Boolean
   */
  isTaskAvailable(task) {
    const { hash } = task;
    return this.processList.has(`${hash}`) && this.#processing.get(`${hash}`);
  }

  /**
   * 獲取相對應的佇列
   * @param {Object} task 任務(執行項目的基本資料)
   * @returns Array || undefined
   */
  getPersonalProcessList(task) {
    const { hash } = task;

    return this.processList.get(`${hash}`);
  }

  /**
   * 若導入的 Task 查詢不到 uid or target 會回傳 false
   * @param {Object} task 任務(執行項目的基本資料)
   * @returns the Map || false
   */
  createMQ(task) {
    const { hash } = task;
    if (hash === undefined) return false;
    console.log(`➫|創建佇列||UID =>> ${hash}|`);

    return this.processList.set(`${hash}`, []) && this.#processing.set(`${hash}`, true);
  }

  /**
   * 將導入的 Task 放入到指定的陣列位置，若查無此列表會回傳 false
   * @param {Object} task 任務(執行項目的基本資料)
   * @returns 
   */
  addTask(task) {
    const { hash } = task;
    //! 如果查無列表將回復 false
    if (!this.processList.has(`${hash}`)) return false;
    console.log(`|新增任務||UID =>> ${hash}|`);

    const personalProcessList = this.processList.get(`${hash}`);
    return personalProcessList.push(task);

  }

  /**
   * 清除掉相對應的佇列
   * @param {Object} task 任務(執行項目的基本資料)
   * @returns 
   */
  closeMQ(task) {
    const { hash } = task;
    if (hash === undefined) return false;
    console.log(`✘|清除佇列||✘ =>> ${hash}|`);
    this.processList.delete(`${hash}`, []);
    this.#processing.delete(`${hash}`, true);

    return
  }

  /**
   * 
   * @param {Array} personalProcessList 個人佇列
   * @param {Function} callback 執行項目
   */
  async startMQ(personalProcessList) {
    if (!Array.isArray(personalProcessList)) return false;
    //! 取出第一格的任務執行
    const task = personalProcessList.shift();
    const { uid, callback } = task;

    //TODO TRY to do something!!!
    console.log(`|開始執行相關任務||UID =>> ${task.uid}|`);

    const ans = await callback(task);
    console.log("任務結果", ans);


    //! 每次執行玩檢測陣列是否還有任務需要執行
    //! * 如果還有任務，就在執行一次
    //! * 如果沒任務了，就移除掉佇列
    if (personalProcessList.length > 0) {
      this.startMQ(personalProcessList, callback);
    } else {
      this.closeMQ(task)
      console.log(personalProcessList);
      return

    }
  }

  async run(task) {
    const { uid, actionType, target, balance_amount, res, callback } = task;
    // Step 檢測使用者佇列是否存在
    if (this.isTaskAvailable(task)) {
      //# 存在的話把任務丟入現有的佇列裡面
      this.addTask(task);
      return;
    }

    // Step 沒有相對應佇列，直接執行任務
    //! 但因為開始執行任務，所以要先創建一個等待列隊，代表此人正在執行相對應行為，其他需排隊
    const createResponse = this.createMQ(task);
    if (!createResponse) return res.send("task格式不正確!!!");
    const personalProcessLis = this.getPersonalProcessList(task);

    // Step 開始執行相關任務
    console.log(`|開始執行相關任務||UID =>> ${uid}|`);
    const ans = await callback(task);
    console.log("任務結果", ans);


    // Step 5 任務完成後
    //! 結束後檢測伺服器內的佇列是否有新增，如果沒有的話移除，有的話就可以開啟處理模式
    (personalProcessLis.length > 0) ? this.startMQ(personalProcessLis) : this.closeMQ(task);

  }

  /**
   * 多重任務排除
   * - 當對象連續發送相同訊息，以防止漏包的情快所使用
   * @param {Object} task 任務(執行項目的基本資料)
   * @returns 
   */
  async multitaskingExclusion(task, speed) {
    const { hash, callback } = task;
    // console.log(callbackParams);
    // Step 檢測使用者佇列是否存在
    if (this.isTaskAvailable(task)) {
      console.log("任務重複");
      return;
    }

    // Step 沒有相對應佇列，直接執行任務
    //! 但因為開始執行任務，所以要先創建一個等待列隊，代表此人正在執行相對應行為，其他需排隊
    const createResponse = this.createMQ(task);
    if (!createResponse) return console.log("task格式不正確!!!");
    const personalProcessLis = this.getPersonalProcessList(task);
    console.log(personalProcessLis);

    // Step 開始執行相關任務
    console.log(`|開始執行相關任務||UID =>> ${hash}|`);
    const ans = await callback();
    console.log("任務結果", ans);


    // Step 5 任務完成後
    //! 設定延遲一秒後進行刪除
    setTimeout(()=>{
      this.closeMQ(task);
    },speed)



  }


}



module.exports = MessageQueue;