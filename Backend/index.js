const express = require('express');

const formidable = require('formidable');

const app = express();

app.use(express.json());


app.post('/api', (req, res) => {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', (formname, file) => {
        // must uncomment for file upload
        // file.filepath = __dirname + '/uploads/' + file.originalFilename;
    });

    res.status(200);
})

app.listen(5000, () => {
    console.log("App is running on port 5000");
})