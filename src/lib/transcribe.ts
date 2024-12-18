'use server'

import { currentUser } from '@clerk/nextjs/server'
import { AssemblyAI } from 'assemblyai'
import { createRecord } from './records'

export const transcribe = async (audioUrl: string) => {
	try {
		const user = await currentUser()

		if (!user?.id) {
			throw new Error('User ID is required')
		}

		if (!process.env.ASSEMBLYAI_API_KEY) {
			throw new Error('AssemblyAI API key is required')
		}

		const client = new AssemblyAI({
			apiKey: process.env.ASSEMBLYAI_API_KEY,
		})

		const data = {
			audio: audioUrl,
		}

		console.log('sdsd')

		const transcript = await client.transcripts.transcribe(data)

		if (!transcript.text) {
			throw new Error('Failed to transcribe audio sadasd')
		}

		if (transcript.status === 'completed') {
			const data = {
				id: crypto.randomUUID(),
				userId: user?.id,
				content: transcript.text || '',
				createdAt: new Date(),
				words: transcript.words ? transcript.words.length : 0,
				duration: transcript.audio_duration || 0,
			}

			await createRecord(data)

			return { success: true, id: data.id }
		}
	} catch (error) {
		console.error('Error transcribing audio:', error)
		throw new Error('Failed to transcribe audio')
	}
}
