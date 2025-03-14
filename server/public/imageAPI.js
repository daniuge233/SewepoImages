const express = require('express');
const fs = require('fs');

const router = express.Router();

const baseimgpth = "./static/data/image/iBase/";
const datapth = "./static/data/image/metadata_imgs.json";

function getData() {
    let data = fs.readFileSync(datapth);
    data = JSON.parse(data);
    return data;
}

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

module.exports = router;