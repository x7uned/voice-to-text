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

export async function deleteUser(id: string) {
	try {
		const fetch = await prisma.user.delete({ where: { id } })
		if (!fetch) {
			throw new Error('User not found')
		}
		return { success: true }
	} catch (error) {
		return { error }
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
