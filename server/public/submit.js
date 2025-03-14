const express = require('express');
const fs = require('fs');
const multer = require('multer');
const uuid = require('uuid');

const router = express.Router();

const baseURL = "/static/data/image";
const basePath = "/data/image";
const datapth = "./static" + basePath + "/metadata_receive.json";

const upload = multer({
    dest: "." + baseURL + '/receivedImages/',
    limits: { fileSize: 1024 * 1024 * 10 }
});

function AppendMetaData(name, id, email, comment, path, append, uuid) {

    var data = fs.readFileSync(datapth);
    data = JSON.parse(data);

    const newMeta = {
        "time": new Date().getTime(),
        "name": name,
        "id": id,
        "email": email,
        "comment": comment,
        "path": path,
        "append": append
    };
    data[uuid] = newMeta;
    fs.writeFileSync(datapth, JSON.stringify(data, null, 2));

}

router.post('/api/submit', upload.single('img'), (req, res) => {

    if (!req.file) {
        return res.status(400).send({ message: 'error' });
    }

    const name = req.body.name;
    const id = req.body.id;
    const email = req.body.email;
    const comment = req.body.comment;
    const _uuid = uuid.v4();

    const appendIndex = req.file.originalname.indexOf(".");
    const append = req.file.originalname.substring(appendIndex);

    let tokens = fs.readFileSync("." + baseURL + "/tokens.json");
    tokens = JSON.parse(tokens);
    if (!tokens.tokens.includes(id)) {
        return res.status(200).send({ message: 'not_correct' });
    } else {
        const fileName = `${_uuid}${append}`;

        fs.renameSync(req.file.path, "." + baseURL + `/receivedImages/${fileName}`);
    
        AppendMetaData(name, id, email, comment, basePath + `/receivedImages/${fileName}`, append, _uuid);
    
        return res.status(200).send({ message: 'success', filename: fileName });
    }
});

module.exports = router;