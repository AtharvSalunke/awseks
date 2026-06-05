const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

// Create Registry
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({
    register
});

// Custom HTTP Request Counter
const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequestsTotal);

// Middleware
app.use((req, res, next) => {
    res.on("finish", () => {
        httpRequestsTotal.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode
        });
    });

    next();
});

// Health endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "user-service"
    });
});

// Main endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from EKS"
    });
});

// Example API endpoint
app.get("/api/users", (req, res) => {
    res.status(200).json([
        {
            id: 1,
            name: "Atharv"
        },
        {
            id: 2,
            name: "John"
        }
    ]);
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});