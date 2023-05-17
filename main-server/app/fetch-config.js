const { fetchGET, fetchPOST } = require('../lib/fetch');
const url = "http://127.0.0.1:3000";
// const url = "http://192.168.85.236:6000"; //base 歆偊

module.exports = {
    async admin(body) {
        try {
            const targetAddress = `${url}/sendToAdmin`
            const result = await fetchPOST({ targetAddress, body });
            return result;
        } catch (error) {
            console.log(error);
            return false;

        }
    },
    async user(body) {
        try {
            const targetAddress = `${url}/sendToUser`
            const result = await fetchPOST({ targetAddress, body });
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
            return false;

        }
    }

}



