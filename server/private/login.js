const express = require("express");

const router = express.Router();

router.use(express.urlencoded({extended: true}));

const chkToken = require("./token").isTokenCorrect;

router.post("/api/backstage/login", (req, res) => {
    const token = req.body.token;

    if (chkToken(token)) {
        res.cookie("token", token);
        res.send({"message": true});
    } else {
        res.send({"message": false});
    }
})

module.exports = router;