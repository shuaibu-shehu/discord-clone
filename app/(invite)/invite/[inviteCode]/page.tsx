import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    }
}

async function InviteCodePage({ params }: InviteCodePageProps) {
    const profile = await currentProfile();
    if (!profile) {
        return auth().redirectToSignIn();
    }

    if (!params.inviteCode) return redirect('/');

    const existingMember = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
    })

    if (existingMember)
        return redirect(`/servers/${existingMember.id}`);

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }

    })

    if (server) return redirect(`/servers/${server.id}`);

    return null
}

export default InviteCodePage