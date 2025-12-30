const express = require("express");
const { doSomeHeavyTask } = require("./util");

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/slow", async (req, res) => {
    try {
        const result = await doSomeHeavyTask();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Express Server Started at http://localhost:${PORT}`);
});