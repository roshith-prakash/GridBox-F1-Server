import { Router } from "express"
import { createPost, getAllRecentPosts, getCircuits, getConstructorStandings, getConstructors, getDriverStandings, getDrivers, getPostById, getQualifyingResult, getRaceResult, getSchedule, getSprintResult, updatePost } from "../controllers/index.js"
import upload from "../utils/multer.js"

// Create a router.
const router = Router()

// Default route to check if routes are accessible.
router.get("/", (req, res) => {
    res.status(200).send({ data: "Default Route" })
})

// Get drivers for a specific year.
router.post("/getDrivers", getDrivers)

// Get constructors for a specific year.
router.post("/getConstructors", getConstructors)

// Get circuits for a specific year.
router.post("/getCircuits", getCircuits)

// Get circuits for a specific year.
router.post("/getSchedule", getSchedule)

// Get driver standings for a specific year.
router.post("/getDriverStandings", getDriverStandings)

// Get constructor standings for a specific year.
router.post("/getConstructorStandings", getConstructorStandings)

// Get result for a specific race.
router.post("/getRaceResult", getRaceResult)

// Get result for a specific race.
router.post("/getQualifyingResult", getQualifyingResult)

// Get result for a specific sprint race.
router.post("/getSprintResult", getSprintResult)

// Create a new post.
router.post("/create-post", upload.single("file"), createPost)

// Update a post
router.post("/update-post", upload.single("file"), updatePost)

// Get recent posts from DB.
router.post("/get-recent-posts", getAllRecentPosts)

// Get specific post from DB.
router.post("/get-post", getPostById)


export default router
