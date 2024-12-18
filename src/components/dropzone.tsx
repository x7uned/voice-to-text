'use client'

import { useToast } from '@/hooks/use-toast'
import { transcribe } from '@/lib/transcribe'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileDropZone() {
	const { toast } = useToast()
	const router = useRouter()

	const onFileUpload = useCallback(
		async (file: File) => {
			try {
				const formData = new FormData()
				formData.append('file', file)

				const response = await axios.post('/api/upload/audio', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				if (response.data.blob.url) {
					const fetch = await transcribe(response.data.blob.url)
					console.log(fetch)
					if (fetch?.success) {
						router.push(`/record/${fetch}`)
					}
				} else {
					const error =
						response.data.error || new Error('Failed to upload file')
					toast({
						title: 'Upload error',
						description: error.message || 'Something went wrong.',
						variant: 'destructive',
					})
				}
			} catch (error) {
				console.error(error)
				toast({
					title: 'Upload error',
					description: 'Unable to upload file. Please try again later.',
					variant: 'destructive',
				})
			}
		},
		[toast]
	)

	// Обработка файла при перетаскивании
	const onDrop = useCallback(
		(
			acceptedFiles: File[],
			fileRejections: import('react-dropzone').FileRejection[]
		) => {
			// Проверка на ошибки
			if (fileRejections.length > 0) {
				fileRejections.forEach(file => {
					file.errors.forEach((err: { code: string; message: string }) => {
						if (err.code === 'file-too-large') {
							toast({
								title: 'File is too large',
								description: 'The maximum file size is 5MB.',
								variant: 'destructive',
							})
						} else if (err.code === 'file-invalid-type') {
							toast({
								title: 'Invalid file type',
								description: 'Only MP3, WAV, and M4A formats are supported.',
								variant: 'destructive',
							})
						} else {
							toast({
								title: 'File upload error',
								description: err.message || 'Something went wrong.',
								variant: 'destructive',
							})
						}
					})
				})
			} else if (acceptedFiles.length === 1) {
				// Отправка только одного файла
				onFileUpload(acceptedFiles[0])
			}
		},
		[onFileUpload, toast]
	)

	// Настройка useDropzone
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'audio/mpeg': ['.mp3'],
			'audio/wav': ['.wav'],
			'audio/x-m4a': ['.m4a'],
		},
		maxSize: 5 * 1024 * 1024,
		multiple: false,
	})

	return (
		<div
			{...getRootProps()}
			className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 cursor-pointer hover:border-gray-400'
		>
			<input {...getInputProps()} />(
			<>
				{isDragActive ? (
					<p className='text-gray-600'>Drop the audio file here...</p>
				) : (
					<>
						<p>Drag and drop an audio file here, or click to select</p>
						<p className='text-sm text-gray-400'>
							Supported formats: MP3, WAV, M4A (max 5MB)
						</p>
						<p className='text-sm text-gray-400'>ONLY ENGLISH LANGUAGE</p>
					</>
				)}
			</>
			)
		</div>
	)
}
