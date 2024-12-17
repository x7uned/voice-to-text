import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({ log: ['query', 'error', 'warn'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function initializePrisma() {
	try {
		await prisma.$connect()
		console.log('Prisma initialized successfully!')
	} catch (error) {
		console.error('Error initializing Prisma:', error)
		process.exit(1)
	}
}

initializePrisma()
