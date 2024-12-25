'use server'

import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
	const userClerk = await currentUser()

	const { amount } = await req.json()

	if (!userClerk) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	if (!process.env.STRIPE_SECRET_KEY) {
		throw new Error('Missing env.STRIPE_SECRET_KEY')
	}

	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

	const user = await prisma.user.findUnique({
		where: {
			clerkId: userClerk.id,
		},
	})

	if (!user) {
		return new NextResponse('User not found', { status: 401 })
	}

	// Ensure that the amount is passed in cents
	const amountInCents = amount * 100

	// Create a one-time payment with the required parameter unit_amount
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: 'Donate',
					},
					unit_amount: amountInCents, // Pass the amount in cents
				},
				quantity: 1,
			},
		],
		mode: 'payment', // Use "payment" mode for a one-time donation
		success_url: `${process.env.URL}/payment-success?amount=${amount}`,
		cancel_url: `${process.env.URL}/error`,
		metadata: {
			userId: user.id,
		},
	})

	return NextResponse.json({ session: session.url })
}
