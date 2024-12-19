'use server'

import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
	const userClerk = await currentUser()

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

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: 'price_1QXkduFoi5EPxsf5Vjsev2RS',
				quantity: 1,
			},
		],
		mode: 'subscription',
		success_url: `${process.env.URL}/premium`,
		cancel_url: `${process.env.URL}/error`,
		metadata: {
			userId: user.id,
		},
	})

	return NextResponse.json({ session: session.url })
}
