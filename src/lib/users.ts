import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export async function createUser(data: User) {
	try {
		const user = await prisma.user.create({ data })
		return { user }
	} catch (error) {
		return { error }
	}
}

export async function canIUpload(clerkId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { clerkId },
			include: { records: true },
		})

		if (!user || (!user.premium && user.records.length >= 2)) {
			return false
		}

		return true
	} catch (error) {
		return { error }
	}
}

export async function deleteUser(id: string) {
	try {
		if (!id) {
			throw new Error('User ID is required')
		}

		// Поиск пользователя по clerkId
		const user = await prisma.user.findUnique({ where: { clerkId: id } })

		if (!user) {
			throw new Error('User not found')
		}

		// Удаление пользователя по ID
		await prisma.user.delete({ where: { id: user.id } })

		return { success: true }
	} catch (error) {
		console.error('Error deleting user:', error)
		throw new Error(`Failed to delete user: ${id}`)
	}
}

export async function getUserById({
	id,
	clerkUserId,
}: {
	id?: string
	clerkUserId?: string
}) {
	try {
		if (!id && !clerkUserId) {
			throw new Error('id or clerkUserId is required')
		}

		const query = id ? { id } : { clerkId: clerkUserId }

		const user = await prisma.user.findUnique({ where: query })
		return { user }
	} catch (error) {
		return { error }
	}
}

export async function UpdateUser(id: string, data: Partial<User>) {
	try {
		const user = await prisma.user.update({
			where: { id },
			data,
		})
		return { user }
	} catch (error) {
		return { error }
	}
}
