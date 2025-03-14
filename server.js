const express = require("express");
const path = require('path');

const submit = require("./server/public/submit");
const login = require("./server/private/login");
const image = require("./server/private/checkImage");
const imageAPI = require("./server/public/imageAPI");

const app = express();

app.use(submit);
app.use(login);
app.use(image);
app.use(imageAPI);

app.use('/data/song', (req, res) => {
    return res.status(403).send('Forbidden');
})

app.use(express.static("./static"));

app.listen(80, () => {
    console.log("Server is running on 0.0.0.0:80")
})