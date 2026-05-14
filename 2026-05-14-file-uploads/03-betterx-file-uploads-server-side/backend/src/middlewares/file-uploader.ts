import type { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            imageUrl: string
        }
    }
}

export default function fileUploader(request: Request, response: Response, next: NextFunction) {
    // this middlewares checks the request
    // if there are files in the request, it should upload them to the cloud
    // it there are no files in the request, just keep going

    if(!request.files) {
        return next()
    } 
    // upload to the cloud, and get a url from the cloud

    // request.imageUrl = the url we got from the cloud
    

}