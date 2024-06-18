import { initialProfile } from "@/lib/initial.profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Initialmodal from "@/components/modals/initial-modal"

async function SetupPage() {
    const profile = await initialProfile()
    let server
    try {
        server = await db.server.findFirst({
        where:{
            members:{
                some:{
                    profileId: profile?.id
                }
            }
        }
    })
    
   } catch (error) {
        console.log('erreor');
            
   }

if(server){
    console.log('redirecting to server page');
    
    return  redirect(`/servers/${server.id}`)
}
  return (
    <div>
        <Initialmodal/>
    </div>
 )
}

export default SetupPage