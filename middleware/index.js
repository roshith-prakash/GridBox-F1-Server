import { redisClient } from "../utils/redis.js";

const cacheMiddleware = async (req, res, next) => {
    try {
        let path = String(req?.originalUrl).split("/")[3]

        let result

        // If drivers info is requested
        if (path == "getDrivers") {
            result = await redisClient.get(`drivers-${req?.body?.year}`)
        }
        // If constructors info is requested
        else if (path == "getConstructors") {
            result = await redisClient.get(`constructors-${req?.body?.year}`)
        }
        // If circuits info is requested
        else if (path == "getCircuits") {
            result = await redisClient.get(`circuits-${req?.body?.year}`)
        }
        // If schedule info is requested
        else if (path == "getSchedule") {
            result = await redisClient.get(`schedule-${req?.body?.year}`)
        }
        // If drivers standings info is requested
        else if (path == "getDriverStandings") {
            result = await redisClient.get(`drivers-standings-${req?.body?.year}`)
        }
        // If constructors standings info is requested
        else if (path == "getConstructorStandings") {
            result = await redisClient.get(`constructors-standings-${req?.body?.year}`)
        }
        // If race result is requested
        else if (path == "getRaceResult") {
            result = await redisClient.get(`race-result-${req?.body?.year}-${req?.body?.round}`)
        }
        // If qualifying result is requested
        else if (path == "getQualifyingResult") {
            result = await redisClient.get(`qualifying-result-${req?.body?.year}-${req?.body?.round}`)
        }
        // If race result is requested
        else if (path == "getSprintResult") {
            result = await redisClient.get(`sprint-result-${req?.body?.year}-${req?.body?.round}`)
        }

        // If value was present, convert to JSON and send result
        if (result) {
            console.log("From Cache")
            return res.status(200).send(JSON.parse(result))
        } else {
            next();
        }


    } catch (error) {
        console.error("Error fetching data from Redis:", error);
        next(); // Proceed to the next middleware in case of error
    }
};

export default cacheMiddleware