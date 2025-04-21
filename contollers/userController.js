import {Webhook} from "svix";
import userModel from "../models/userModel.js";
import {planModel} from "../models/planModel.js";


export const clerkWebhooks = async (request, response) => {
    try {

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(request.body),{
            "svix-id": request.headers['svix-id'],
            "svix-timestamp": request.headers["svix-timestamp"],
            "svix-signature": request.headers["svix-signature"]
        })

        const {data, type} = request.body

        switch (type) {
            case 'user.created': {


                console.log('webhook receiver', request.body)

                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    full_name: data.first_name + "" + data.last_name,
                    photo: data.image_url
                }

                await userModel.create(userData)
                response.json({})

                break;
            }
            case "user.updated": {
                console.log('webhook receiver', request.body)
                const userData = {
                    email: data.email_addresses[0].email_address,
                    full_name: data.first_name + "" + data.last_name,
                    photo: data.image_url
                }

                await userModel.findOneAndUpdate({clerkId: data.id}, userData)
                response.json({})

                break;
            }
            case "user.deleted": {
                console.log('webhook receiver', request.body)
                await userModel.findOneAndDelete({clerkId: data.id})
                response.json({})


                break
            }

            default: {
                break
            }

        }
    } catch (error) {
        console.log(error)
        response.json({success:false, message:error.message})
    }
}
export const getUserPlan = async (req, res) => {
    try {
        const userId = req.user.id
        console.log(userId, 'getUserPlan --- userId')

        const plans = await planModel.find({userId}).sort({createdAt: -1})
        const activePlan = await planModel.find({userId, isActive:true})
        console.log(activePlan)
        console.log(plans)
            res.json({success:true, plans})

    } catch (error) {
        res.json({success:false, message:error.message})
    }

}


