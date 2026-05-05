import type { NextFunction, Request, Response } from "express";
import Post from "../../models/Post";
import User from "../../models/User";
import Comment from "../../models/Comment";

export async function getProfile(request: Request, response: Response, next: NextFunction) {

    const userId = '1230ae30-dc4f-4752-bd84-092956f5c633'
    // this is the naive SQL way to start getting data...
    // equivalent to select * from posts where user_id = 'hjshjsdhjksdfhjkf'
    // const posts = await Post.findAll({ where: { userId } })

    // since we have sequelize, and User already has a posts: Post[]
    // declaration in the HasMany, we can simply fetch the user
    const user = await User.findByPk(userId, {
        include: [{
            model: Post,
            include: [
                User,
                { 
                    model: Comment,
                    include: [ User ]
                }
            ]
        }]
    })


    response.json(user)

}


