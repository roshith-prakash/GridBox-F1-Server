import { Request, Response, NextFunction } from "express";
import { redisClient } from "../utils/redis.ts";

// To check if data is present in Redis cache
const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get requested path
    let path = String(req?.originalUrl).split("/")[3];

    let result;

    // If drivers standings info is requested
    if (path == "getDriverStandings") {
      result = await redisClient.get(`drivers-standings-${req?.body?.year}`);
    }
    // If constructors standings info is requested
    else if (path == "getConstructorStandings") {
      result = await redisClient.get(
        `constructors-standings-${req?.body?.year}`
      );
    } else if (path == "getNextRace") {
      result = await redisClient.get(`next-race`);
    }

    if (result) {
      // If value was present, convert to JSON and send result
      res.status(200).send(JSON.parse(result));
      return;
    } else {
      next();
    }
  } catch (error) {
    console.error("Error fetching data from Redis:", error);
    next(); // Proceed to the next middleware in case of error
  }
};

export default cacheMiddleware;
