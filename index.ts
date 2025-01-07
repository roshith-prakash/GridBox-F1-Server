import http from "http";
import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
dotenv.config();

// Importing Routes ----------------------------------------------------------------------------------------------

import routes from "./routes/index.ts";

// Importing Middleware ----------------------------------------------------------------------------------------------

import middleware from "./middleware/index.ts";

// Initializing Server -------------------------------------------------------------------------------------------

const app: Express = express();
let server = http.createServer(app);

// Using Middleware -------------------------------------------------------------------------------------------

// Whitelist for domains
const whitelist = [
  "http://localhost:3000",
  "https://gridbox.vercel.app",
  "https://gridbox-f1.vercel.app",
];

// Function to deny access to domains except those in whitelist.
const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Find request domain and check in whitelist.
    if (whitelist.indexOf(origin) !== -1) {
      // Accept request
      callback(null, true);
    } else {
      // Send CORS error.
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Parses request body.
app.use(express.urlencoded({ extended: true }));
// Parses JSON passed inside body.
app.use(express.json());
// Enable CORS
app.use(cors(corsOptions));
// Add security to server.
app.use(helmet());

// Routes -------------------------------------------------------------------------------------------

// Default route to check if server is working.
app.get("/", (req, res) => {
  res.status(200).send("We are good to go!");
});

// Routes -----------------------------------------------------------------------------------------

app.use("/api/v1", middleware, routes);

// Listening on PORT -------------------------------------------------------------------------------------------

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
