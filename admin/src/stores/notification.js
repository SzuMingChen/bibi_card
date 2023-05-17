import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { socket } from '../socket';



export const useNotification = defineStore('notification', () => {
    const notificationList = ref([])

    return {
        notificationList,
    }
});

// listen for notifications
socket.on('notification', (message) => {
    console.log("notification", message);
    const {target, msg} = message.data;
    const list = useNotification().notificationList;


    const notification = {
        target,
        msg,
        visible: true
    };

    list.push(notification);
    console.log(list);
    setTimeout(() => {
        console.log(list);
        list.shift();
    }, 3000);

});