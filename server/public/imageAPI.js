const express = require('express');
const fs = require('fs');
const sharp = require("sharp");

const router = express.Router();

const baseimgpth = "./static/data/image";
const datapth = "./static/data/image/metadata_imgs.json";

function getData() {
    let data = fs.readFileSync(datapth);
    data = JSON.parse(data);
    return data;
}

// 随机图片
router.get("/api/image/random/:type", (req, res) => {
    let data = getData();
    let db = data["DataBase"];
    let randID = db[Math.floor(Math.random() * db.length)];

    let type = req.params.type;
    if (type == "img") {
        res.redirect(`/data/image/iBase/${randID}${data[randID].append}`);
        return;
    }

    let randData = data[randID];

    return res.status(200).send(randData);
})

// 根据ID获取图片
// process: 是否压缩(compress/none)
// id: 图片uuid
// where: iBase或ReceivedImages, 服务于不同应用场景
router.get("/api/image/get/:process/:id/:where", (req, res) => {
    let data = null;

    if (!req.params.id) {
        return res.status(404).send({ message: "Not Found" });
    }
    let loc = "iBase";
    if (req.params.where == "check") {
        loc = "receivedImages";
        data = JSON.parse(fs.readFileSync(`${baseimgpth}/metadata_receive.json`));
    } else {
        loc = "iBase";
        data = getData();
    }

    let img = fs.readFileSync(`${baseimgpth}/${loc}/${req.params.id}${data[req.params.id].append}`)
    if (!img) {
        return res.status(404).send({ message: "Not Found" });
    }
    
    switch(req.params.process) {
        case "compress":
            sharp(img)
                .resize(null, null, { fit: 'inside' })
                .jpeg({ mozjpeg: true, quality: 15 })
                .toBuffer((err, buffer) => {
                    if (err) throw err;
                    else return res.status(200).set("Content-Type", "image/jpeg").send(buffer);
                });
            break;
        case "none":
            res.status(200).set("Content-Type", "image/jpeg").send(img);
            break;
        default:
            res.status(200).set("Content-Type", "image/jpeg").send(img);
            break;
    }
})

module.exports = router;