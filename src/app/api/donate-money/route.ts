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

	// Убедитесь, что amount передается в центрах
	const amountInCents = amount * 100

	// Создаем одноразовый платеж с обязательным параметром unit_amount
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: 'Donate',
					},
					unit_amount: amountInCents, // Передаем сумму в центрах
				},
				quantity: 1,
			},
		],
		mode: 'payment', // Используем режим "payment" для одноразового взноса
		success_url: `${process.env.URL}/payment-success?amount=${amount}`,
		cancel_url: `${process.env.URL}/error`,
		metadata: {
			userId: user.id,
		},
	})

	return NextResponse.json({ session: session.url })
}
