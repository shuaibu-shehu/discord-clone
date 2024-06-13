import { currentUser, auth } from "@clerk/nextjs/server";

import {db} from "@/lib/db";

export const initialProfile = async() => {
const user = await currentUser();

if(!user){
    return auth().redirectToSignIn();
 }
 const profile = await db.profile.findFirst({
        where:{
            userId: user.id
        }
    });

    if(profile){
        return profile
    }

    const newProfile = await db.profile.create({
        data:{
            userId: user.id,
            name: `${user.firstName} ${user.fullName}`,  
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,

        }
        
    })
    return newProfile;
}