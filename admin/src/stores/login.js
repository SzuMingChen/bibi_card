import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useLogin = defineStore('login', () => {
    const admin_uid = ref('');

    return {
        admin_uid,
    }
});