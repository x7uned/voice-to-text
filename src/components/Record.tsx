'use client'

import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Button } from './ui/button'
import CodeCard from './ui/code'
import { Separator } from './ui/separator'

interface RecordProps {
	text: string
	duration?: number | null
	words?: number
	date?: string
}

const Record = ({ text, duration, words, date }: RecordProps) => {
	const [showText, setShowText] = useState(false)
	const { toast } = useToast()

	// Copy text to clipboard
	const handleCopy = () => {
		navigator.clipboard.writeText(text)
		toast({
			title: 'Text copied',
			description: 'Text copied to clipboard',
		})
	}

	// Download text as .txt file
	const handleDownload = () => {
		const blob = new Blob([text], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'transcribed-text.txt'
		link.click()
		URL.revokeObjectURL(url) // Free memory
	}

	return (
		<div className='flex gap-5 justify-center items-center text-center flex-col w-2/3 xl:w-2/5 h-auto'>
			<h1 className='text-4xl font-bold'>Voice to Text</h1>
			<div className='flex flex-col items-center text-center xl:flex-row w-full justify-around'>
				<div className='flex w-1/3 flex-col'>
					<p className='text-2xl'>Duration</p>
					<p className='text-4xl font-bold flex-wrap'>{duration}s</p>
				</div>
				<Separator orientation='vertical' />
				<div className='flex w-1/3 flex-col'>
					<p className='text-2xl'>Words</p>
					<p className='text-4xl font-bold flex-wrap'>{words}</p>
				</div>
				<Separator orientation='vertical' />
				<div className='flex w-1/3 flex-col'>
					<p className='text-2xl'>Created</p>
					<p className='text-2xl font-bold flex-wrap'>{date}</p>
				</div>
			</div>
			<CodeCard>
				<div className={`${showText ? 'h-auto' : 'h-24'} overflow-hidden`}>
					{text}
				</div>
			</CodeCard>

			<div className='flex justify-between gap-1 flex-col xl:flex-row w-full'>
				<Button variant='outline' onClick={() => setShowText(!showText)}>
					{showText ? 'Hide' : 'Show'} text
				</Button>
				<Button onClick={handleCopy}>Copy text</Button>
				<Button onClick={handleDownload}>Download txt</Button>
			</div>
		</div>
	)
}

export default Record
