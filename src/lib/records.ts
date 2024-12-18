import prisma from '@/lib/prisma'
import { Record } from '@prisma/client'

export async function createRecord(data: Record) {
	try {
		const record = await prisma.record.create({
			data,
		})

		console.log('record:', record)
		return { record }
	} catch (error) {
		console.error(error)
		throw new Error('Failed to create record')
	}
}

export async function getRecordById(id: string) {
	try {
		if (!id) {
			throw new Error('Record ID is required')
		}

		const record = await prisma.record.findUnique({ where: { id } })

		if (!record) {
			throw new Error('Record not found')
		}

		return { record }
	} catch (error) {
		console.error('Error getting record:', error)
		throw new Error(`Failed to get record: ${id}`)
	}
}
