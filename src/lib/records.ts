'use server'

import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

interface CreateRecord {
	clerkId: string
	text: string
	words: number
	duration: number
	uploadLink: string
}

export async function createRecord(data: CreateRecord) {
	try {
		const user = await prisma.user.findUnique({
			where: { clerkId: data.clerkId },
		})

		if (!user) {
			throw new Error('User not found')
		}

		const record = await prisma.record.create({
			data: {
				userId: user?.id,
				text: data.text,
				words: data.words,
				duration: data.duration,
				uploadLink: data.uploadLink,
			},
		})

		return record
	} catch (error) {
		console.error(error)
		throw new Error('Failed to create record')
	}
}

export async function getMyRecords() {
	try {
		const clerkUser = await currentUser()

		if (!clerkUser?.id) {
			throw new Error('User ID is required')
		}

		const user = await prisma.user.findUnique({
			where: { clerkId: clerkUser.id },
		})

		if (!user) {
			throw new Error('User not found')
		}

		const records = await prisma.record.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: 'desc' },
		})

		return { records, success: true }
	} catch (error) {
		console.error(error)
		throw new Error('Failed to get records')
	}
}

export async function getRecordById(id: string) {
	try {
		if (!id) {
			throw new Error('Record ID is required')
		}

		const user = await currentUser()

		if (!user?.id) {
			throw new Error('User ID is required')
		}

		const record = await prisma.record.findUnique({ where: { id } })

		const owner = await prisma.user.findUnique({
			where: { id: record?.userId },
		})

		if (!record || owner?.clerkId !== user.id) {
			throw new Error('Access Denied')
		}

		return record
	} catch (error) {
		console.error('Error getting record:', error)
		throw new Error(`Failed to get record: ${id}`)
	}
}
