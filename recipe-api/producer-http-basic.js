#!/usr/bin/env node
const express = require("express");
const app = express();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

console.log(`worker pid=${process.pid}`);

app.get("/recipes/:id", async (req, res) => {
    console.log(`worker request pid=${process.pid}`)
    const id = Number(req.params.id);
    if (id !== 42) {
        return res.status(404).json({ error: "not_found" });
    }
    const resObj = {
        producer_pid: process.pid,
        recipe: {
            id, name: "Chicken Tikka Masala",
            steps: "Throw it in a pot...",
            ingredients: [
                {
                    id: 1, name: "Chicken", quantity: "1 lb"

                },
                {
                    id: 2,
                    name: "Sauce", quantity: "2 cups",
                }
            ]
        }
    }
    res.status(200).json(resObj);
})

app.listen(PORT, HOST, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`);
})