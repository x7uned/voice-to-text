'use client'

import LoadingScreen from '@/components/loading.screen'
import Record from '@/components/Record'
import { getRecordById } from '@/lib/records'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Record {
	id: string
	userId: string
	text: string
	duration: number
	words: number
	uploadLink: string
	createdAt: Date
}

const RecordPage = () => {
	const params = useParams<{ id: string }>()
	const [loading, setLoading] = useState(true)

	const [record, setRecord] = useState<Record | null>(null)

	const fetchRecord = async () => {
		try {
			const recordfetch = await getRecordById(params.id)
			if (recordfetch) {
				setRecord(recordfetch)
			}
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		fetchRecord()
	}, [params.id, fetchRecord])

	const timeAgo = (date: Date) => {
		const now = new Date()
		const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
		let interval = Math.floor(seconds / 31536000)

		if (interval > 1) {
			return `${interval} years ago`
		}
		interval = Math.floor(seconds / 2592000)
		if (interval > 1) {
			return `${interval} months ago`
		}
		interval = Math.floor(seconds / 86400)
		if (interval > 1) {
			return `${interval} days ago`
		}
		interval = Math.floor(seconds / 3600)
		if (interval > 1) {
			return `${interval} hours ago`
		}
		interval = Math.floor(seconds / 60)
		if (interval > 1) {
			return `${interval} minutes ago`
		}
		return `just now`
	}

	if (loading) {
		return <LoadingScreen />
	}

	if (!record) {
		return (
			<div className='flex justify-center items-center h-screen w-screen'>
				<p className='text-2xl'>Record not found</p>
			</div>
		)
	}

	return (
		<div className='flex justify-center items-center min-h-screen w-screen'>
			<Record
				text={record?.text}
				words={record?.words}
				duration={record?.duration}
				date={timeAgo(record?.createdAt)}
			/>
		</div>
	)
}

export default RecordPage
