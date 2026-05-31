const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

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
        message: "Hello from EKS Microservice"
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});