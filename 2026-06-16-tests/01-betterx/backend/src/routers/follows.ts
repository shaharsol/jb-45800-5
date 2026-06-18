import { Router } from "express";
import { follow, getFollowers, getFollowing, suggest, unfollow } from "../controllers/follows/controller";

const followsRouter = Router()

followsRouter.get('/followers', getFollowers)
followsRouter.get('/following', getFollowing)
followsRouter.get('/suggest', suggest)
followsRouter.post('/follow/:followeeId', follow)
followsRouter.post('/unfollow/:followeeId', unfollow)

export default followsRouter