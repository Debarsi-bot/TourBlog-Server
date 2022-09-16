import express from "express"
import {signup,signin} from "../controllers/user.js"

//A router object is an isolated instance of middleware
const router = express.Router()

router.post("/signup", signup)
router.post("/signin",signin)

export default router;