const router = require("express").Router();

router.use((req,res,next) => {
    console.log("A request id coming to route.js");
    next();
});


module.exports = router;