#!/usr/bin/env node

const express = require("express");
const app = express();
const axios = require("axios");
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";
const HOST = process.env.HOST || "127.0.0.1";


app.get("/", async (req, res) => {
    const { data } = await axios({
        method: "get",
        url: `http://${TARGET}/recipes/42`
    })
    const obj = {
        consumer_pid: process.pid,
        producer_data: data
    }
    res.status(200).json(obj);
})

app.listen(PORT, HOST, () => {
    console.log(`Consumer running at http://${HOST}:${PORT}`);
})

