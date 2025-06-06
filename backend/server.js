import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import errorHandler from "./src/controllers/auth/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

// middlewares
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the public directory
app.use("/public", express.static("./src/public"));

// Error handling middleware
app.use(errorHandler);

// routes
const routesFiles = fs.readdirSync("./src/routes");

routesFiles.forEach((file) => {
    if (file.endsWith(".js")) {
        // Dynamically import the route file
        import(`./src/routes/${file}`)
            .then((routeModule) => {
                const route = routeModule.default;
                app.use("/api/v1", route);
            })
            .catch((error) => {
                console.error(`Error loading route ${file}:`, error);
            });
    }
});

const server = async () => {
    try {
        // Connect to the database
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

server();
