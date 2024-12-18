import { auth, currentUser } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		const user = await currentUser()

		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		let dbUser = await prisma.user.findUnique({
			where: {
				clerkId: user.id,
			},
		})

		if (!dbUser) {
			dbUser = await prisma.user.create({
				data: {
					clerkId: user.id,
					email: user.emailAddresses[0].emailAddress ?? '',
				},
			})
		}

		return new NextResponse(null, {
			status: 302,
			headers: { Location: 'https://voice-to-text-five.vercel.app/' },
		})
	} catch (error) {
		console.error('Error saving user:', error)
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
