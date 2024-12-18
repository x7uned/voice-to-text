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

		const client = new AssemblyAI({
			apiKey: process.env.ASSEMBLYAI_API_KEY || 'notfound',
		})

		const data = {
			audio: audioUrl,
		}

		const transcript = await client.transcripts.transcribe(data)

		if (!transcript.text) {
			throw new Error('Failed to transcribe audio sadasd')
		}

		if (transcript.status === 'completed') {
			const data = {
				clerkId: user?.id,
				text: transcript.text || '',
				words: transcript.words ? transcript.words.length : 0,
				duration: transcript.audio_duration || 0,
				uploadLink: audioUrl,
			}

			const record = await createRecord(data)

			return { success: true, id: record?.id }
		} else {
			console.error('Transcription failed:', transcript)
			return { success: false, error: 'Transcription failed' }
		}
	} catch (error) {
		console.error('Error transcribing audio:', error)
		throw new Error('Failed to transcribe audio')
	}
}
