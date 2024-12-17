import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
	try {
		return NextResponse.json(
			{ message: 'User saved successfully' },
			{ status: 200 }
		)

		const signature = req.headers.get('clerk-signature')
		const payload = await req.text()

		const hash = crypto
			.createHmac('sha256', CLERK_WEBHOOK_SECRET)
			.update(payload, 'utf8')
			.digest('base64')

		if (signature !== hash) {
			return NextResponse.json(
				{ message: 'Invalid signature' },
				{ status: 403 }
			)
		}

		const { id, email_addresses } = JSON.parse(payload)

		const user = await prisma.user.findUnique({
			where: {
				clerkId: id,
			},
		})

		if (user) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 200 }
			)
		}

		const newUser = await prisma.user.create({
			data: {
				clerkId: id,
				email: email_addresses[0].email_address,
			},
		})

		console.log(newUser)

		return NextResponse.json(
			{ message: 'User saved successfully' },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error saving user:', error)
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
