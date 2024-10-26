import { Router } from "express"
import { getCircuits, getConstructorStandings, getConstructors, getDriverStandings, getDrivers, getQualifyingResult, getRaceResult, getSchedule } from "../controllers/index.js"

// Create a router.
const router = Router()

// Default route to check if routes are accessible.
router.get("/", (req, res) => {
    res.status(200).send({ data: "Default Route" })
})

// Get drivers for a certain year.
router.post("/getDrivers", getDrivers)

// Get constructors for a certain year.
router.post("/getConstructors", getConstructors)

// Get circuits for a certain year.
router.post("/getCircuits", getCircuits)

// Get circuits for a certain year.
router.post("/getSchedule", getSchedule)

// Get driver standings for a certain year.
router.post("/getDriverStandings", getDriverStandings)

// Get constructor standings for a certain year.
router.post("/getConstructorStandings", getConstructorStandings)

// Get result for a certain race.
router.post("/getRaceResult", getRaceResult)

// Get result for a certain race.
router.post("/getQualifyingResult", getQualifyingResult)


export default router
