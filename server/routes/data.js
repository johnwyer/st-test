const express = require('express');
const router = express.Router();

var fs = require("fs");

router.get('/data', (req, res) => {
    fs.readFile("server/nba.json", function(error, buf) {
        if (error) {
            return res.status(400).send(error);
        }

        res.status(200).send(buf.toString());
    });
});

module.exports = router;