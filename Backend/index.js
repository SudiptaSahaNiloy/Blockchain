const express = require('express');

const formidable = require('formidable');

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
    res.json({
        "users": "user1",
    })
})

app.post('/api', (req, res) => {
    const body = req.body;
    res.json(body);

    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', (formname, file) => {
        file.filepath = __dirname + '/uploads/' + file.originalFilename;
    });

    // res.json({key, files});

    res.status(200);
})

app.listen(5000, () => {
    console.log("App is running on port 5000");
})