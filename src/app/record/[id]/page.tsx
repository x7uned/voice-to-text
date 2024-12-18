'use client'

import { getRecordById } from '@/lib/records'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

const RecordPage = () => {
	const params = useParams<{ id: string }>()

	useEffect(() => {
		const fetch = getRecordById(params.id)

		console.log(fetch)
	}, [params.id])

	{
		/* <Transcribe
				words={transcript.words}
				text={transcript.text}
				duration={transcript.duration}
			/> */
	}

	return (
		<div className='flex justify-center items-center h-screen w-screen'>
			<h1>Record page</h1>
			<p>{params.id}</p>
		</div>
	)
}

export default RecordPage
