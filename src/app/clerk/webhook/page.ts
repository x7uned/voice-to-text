import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' })
	}

	const signature = req.headers['clerk-signature'] as string
	const payload = JSON.stringify(req.body)
	const hash = crypto
		.createHmac('sha256', CLERK_WEBHOOK_SECRET)
		.update(payload, 'utf8')
		.digest('base64')

	if (signature !== hash) {
		return res.status(403).json({ message: 'Invalid signature' })
	}

	const { id, email_addresses } = req.body

	try {
		// Сохраняем нового пользователя в БД
		await prisma.user.create({
			data: {
				clerkId: id,
				email: email_addresses[0].email_address, // Основной email пользователя
			},
		})

		return res.status(200).json({ message: 'User saved successfully' })
	} catch (error) {
		console.error('Error saving user:', error)
		return res.status(500).json({ message: 'Internal Server Error' })
	}
}
