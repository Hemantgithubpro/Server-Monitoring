const express = require("express");
const client=require("prom-client"); // metric collection
const { doSomeHeavyTask } = require("./util");

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({register: client.register});

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

app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
    // res.set("Content-Type", client.register.contentType);
    // res.end(await client.register.metrics());
});

app.listen(PORT, () => {
    console.log(`Express Server Started at http://localhost:${PORT}`);
});