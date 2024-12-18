'use client'

import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

interface TranscribeProps {
	text: string
	duration?: number | null
	words?: number
}

const Transcribe = ({ text, duration, words }: TranscribeProps) => {
	const [showText, setShowText] = useState(false)
	const { toast } = useToast()

	// Копирование текста в буфер обмена
	const handleCopy = () => {
		navigator.clipboard.writeText(text)
		toast({
			title: 'Text copied',
			description: 'Text copied to clipboard',
		})
	}

	// Скачивание текста в формате .txt
	const handleDownload = () => {
		const blob = new Blob([text], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'transcribed-text.txt'
		link.click()
		URL.revokeObjectURL(url) // Освобождаем память
	}

	return (
		<div className='flex gap-2 justify-center items-center text-center flex-col w-1/3'>
			<div className='flex w-full justify-around'>
				<div className='flex flex-col'>
					<p className='text-2xl'>Duration</p>
					<p className='text-3xl'>{duration}s</p>
				</div>
				<Separator orientation='vertical' />
				<div className='flex flex-col'>
					<p className='text-2xl'>Words</p>
					<p className='text-3xl'>{words}</p>
				</div>
			</div>
			<div
				className={`${
					showText ? 'h-auto' : 'h-24'
				} transition-all duration-200 overflow-hidden`}
			>
				{text}
			</div>
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

export default Transcribe
