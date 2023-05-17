module.exports = (socket)=>{
    require('./admin')(socket);
    require('./user')(socket);

};