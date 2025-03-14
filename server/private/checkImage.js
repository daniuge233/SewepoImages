const express = require("express");
const fs = require('fs');
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

const chkToken = require("./token").isTokenCorrect;
const receivedDataPth = "./static/data/image/metadata_receive.json";
const checkedDataPth = "./static/data/image/metadata_imgs.json";

router.get("/api/image/examine/get", (req, res) => {
    const token = req.cookies.token;
    if (!chkToken(token)) {
        return res.status(403).send("Forbidden");
    }

    let data = fs.readFileSync(receivedDataPth);
    // data = JSON.stringify(data);

    return res.status(200).send({ message: data.toString() });
})


// 删除图片
router.get("/api/image/examine/remove/:id", (req, res) => {
    const token = req.cookies.token;
    if (!chkToken(token)) {
        return res.status(403).send("Forbidden");
    }

    let data = fs.readFileSync(receivedDataPth);
    data = JSON.parse(data);

    if (data[req.params.id]) {
        fs.unlinkSync("./static" + data[req.params.id].path);

        delete data[req.params.id];
        fs.writeFileSync(receivedDataPth, JSON.stringify(data, null, 2));
    }

    return res.status(200).send({ message: "success" });
})


router.get("/api/image/examine/accept/:id", (req, res) => {
    const token = req.cookies.token;
    if (!chkToken(token)) {
        return res.status(403).send("Forbidden");
    }

    // 旧元数据文件路径
    let data = fs.readFileSync(receivedDataPth).toString();
    data = JSON.parse(data);
    console.log(data);

    // 新元数据文件路径
    let Ndata = fs.readFileSync(checkedDataPth).toString();
    Ndata = JSON.parse(Ndata);

    if (data[req.params.id]) {

        var imgPth = `./static/data/image/iBase/${req.params.id}${data[req.params.id].append}`;

        // 新元数据文件
        Ndata[req.params.id] = data[req.params.id];
        Ndata["DataBase"].push(req.params.id);
        Ndata[req.params.id].path = imgPth;

        fs.renameSync(`./static/data/image/receivedImages/${req.params.id}${data[req.params.id].append}`, imgPth);
        fs.writeFileSync(checkedDataPth, JSON.stringify(Ndata, null, 2));

        delete data[req.params.id];
        fs.writeFileSync(receivedDataPth, JSON.stringify(data, null, 2));
    }

    return res.status(200).send({ message: "success" });
})


// ----


router.get("/api/image/check/get", (req, res) => {
    const token = req.cookies.token;
    if (!chkToken(token)) {
        return res.status(403).send("Forbidden");
    }

    let data = fs.readFileSync(checkedDataPth);

    return res.status(200).send({ message: data.toString() });
})

router.get("/api/image/check/remove/:id", (req, res) => {
    const token = req.cookies.token;
    if (!chkToken(token)) {
        return res.status(403).send("Forbidden");
    }

    let data = fs.readFileSync(checkedDataPth);
    data = JSON.parse(data);

    if (data[req.params.id]) {
        fs.unlinkSync("./static" + data[req.params.id].path);

        delete data[req.params.id];
        delete data["Database"][data["Database"].indexof("req.params.id")];
        fs.writeFileSync(checkedDataPth, JSON.stringify(data, null, 2));
    }

    return res.status(200).send({ message: "success" });
})

module.exports = router;