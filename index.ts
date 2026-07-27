import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
dotenv.config();

// Importing Routes ----------------------------------------------------------------------------------------------

import routes from "./routes/index.ts";

// Importing Middleware ----------------------------------------------------------------------------------------------

import middleware from "./middleware/index.ts";

// Initializing Server -------------------------------------------------------------------------------------------

const app: Express = express();

// Using Middleware -------------------------------------------------------------------------------------------

// Whitelist for domains
const whitelist = [
  "http://localhost:3000",
  "https://gridbox.vercel.app",
  "https://gridbox-f1.vercel.app",
];

// Function to deny access to domains except those in whitelist.
const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (e.g. server-to-server, Vercel health checks)
    if (!origin) {
      callback(null, true);
      return;
    }
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
app.get("/", (_, res) => {
  res.status(200).send("We are good to go!");
});

// Routes -----------------------------------------------------------------------------------------

app.use("/api/v1", middleware, routes);

// Export app for Vercel serverless deployment
export default app;
