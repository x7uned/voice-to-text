import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
	const sig = req.headers.get('stripe-signature') || ''
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

	let event: Stripe.Event

	try {
		const body = await req.text()
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
	} catch (err) {
		console.error('Webhook signature verification failed.', err)
		return new NextResponse('Webhook Error', { status: 400 })
	}

	const { type, data } = event

	try {
		switch (type) {
			case 'payment_intent.created':
				await prisma.payment.create({
					data: {
						stripeId: data.object.id,
						status: 'created',
						amount: data.object.amount / 100,
						currency: data.object.currency,
						createdAt: new Date(),
						userId: data.object.metadata.userId,
					},
				})
				break

			case 'payment_intent.succeeded':
				await prisma.payment.update({
					where: { stripeId: data.object.id },
					data: { status: 'succeeded' },
				})
				break

			case 'payment_intent.canceled':
				await prisma.payment.update({
					where: { stripeId: data.object.id },
					data: { status: 'canceled' },
				})
				break

			default:
				console.warn(`Unhandled event type: ${type}`)
		}

		return new NextResponse('Success', { status: 200 })
	} catch (err) {
		console.error('Database operation failed.', err)
		return new NextResponse('Database Error', { status: 500 })
	}
}
