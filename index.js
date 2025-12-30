const express = require("express");
const client = require("prom-client"); // metric collection
const { doSomeHeavyTask } = require("./util");
const responseTime = require("response-time");

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({
    name: "http_express_request_response_time",
    help: "This tells how much time is taken by request and response cycle",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 1.5, 2, 0.02] // in seconds
});

const totalReqCounter=new client.Counter({
    name:"total_req",
    help:"Total number of requests received",
})

app.use(responseTime((req, res, time) => {
    totalReqCounter.inc();
    reqResTime.labels(
        method = req.method,
        route = req.url,
        status_code = res.statusCode
    ).observe(time);
}));


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