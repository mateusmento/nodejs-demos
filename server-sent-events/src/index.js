const express = require('express');

const app = express();

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));

app.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");

    setInterval(() => {
        res.write("data: Hello world!\n\n");
    }, 1000);
});

app.listen(3000);
