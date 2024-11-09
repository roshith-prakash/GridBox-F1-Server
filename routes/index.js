import { Router } from "express"
import { createPost, getAllRecentPosts, getCircuits, getConstructorStandings, getConstructors, getDriverStandings, getDrivers, getPostById, getQualifyingResult, getRaceResult, getSchedule, updatePost } from "../controllers/index.js"
import upload from "../utils/multer.js"

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

// Create a new post.
router.post("/create-post", upload.single("file"), createPost)

// Update a post
router.post("/update-post", upload.single("file"), updatePost)

// Get recent posts from DB.
router.post("/get-recent-posts", getAllRecentPosts)

// Get specific post from DB.
router.post("/get-post", getPostById)


export default router
