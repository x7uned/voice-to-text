import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
	const sig = headers().get('Stripe-Signature') as string

	let event: Stripe.Event

	try {
		const body = await req.text()
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!
		)
	} catch (err) {
		console.error('Webhook signature verification failed.', err)
		return new NextResponse('Webhook Error', { status: 400 })
	}

	const { type, data } = event

	try {
		switch (type) {
			case 'checkout.session.completed': {
				const session = data.object as Stripe.Checkout.Session

				const userId = session.metadata?.userId

				if (!userId) {
					console.warn('Missing userId in metadata')
					return new NextResponse('Metadata Error', { status: 400 })
				}

				const payment = await prisma.payment.create({
					data: {
						stripeId: session.id,
						currency: session.currency!,
						status: 'paid',
						createdAt: new Date(session.created * 1000),
						userId: userId,
						amount: session.amount_total!,
					},
				})

				if (!payment) {
					console.error('Payment creation failed')
					return new NextResponse('Database Error', { status: 500 })
				}

				if (!userId) {
					console.warn('Missing userId in metadata')
					return new NextResponse('Metadata Error', { status: 400 })
				}

				await prisma.user.update({
					where: { id: userId },
					data: { premium: true },
				})

				console.log(`User ${userId} upgraded to premium`)
				break
			}
		}

		return new NextResponse('Success', { status: 200 })
	} catch (err) {
		console.error('Database operation failed.', err)
		return new NextResponse('Database Error', { status: 500 })
	}
}
