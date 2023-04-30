import Express  from "express";
import { getFollowers,follow,unfollow } from "../controllers/relationship.js";

const router=Express.Router()

router.get("/",getFollowers)
router.post("/",follow)
router.delete("/",unfollow)


export default router