import express from "express";
import {clerkWebhooks, getUserPlan} from "../contollers/userController.js";

const userRouter=  express.Router()

userRouter.post('/webhooks', clerkWebhooks)

userRouter.get('/get-profile', getUserPlan)

export default userRouter