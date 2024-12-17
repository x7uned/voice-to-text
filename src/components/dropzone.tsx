'use client'

import { useToast } from '@/hooks/use-toast'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FileDropZone() {
	const { toast } = useToast()

	const onFileUpload = (files: File[]) => {
		toast({
			title: 'Success',
			description: 'File was successfuly uploaded.',
		})
		console.log('Uploaded files:', files)
	}

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: any[]) => {
			// Проверка на ошибки
			if (fileRejections.length > 0) {
				fileRejections.forEach(file => {
					file.errors.forEach((err: any) => {
						if (err.code === 'file-too-large') {
							toast({
								title: 'File is too large',
								description: 'The maximum file size is 25MB.',
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
			} else {
				onFileUpload(acceptedFiles)
			}
		},
		[onFileUpload, toast]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'audio/mpeg': ['.mp3'],
			'audio/wav': ['.wav'],
			'audio/x-m4a': ['.m4a'],
		},
		maxSize: 25 * 1024 * 1024, // Ограничение на 25MB
	})

	return (
		<div
			{...getRootProps()}
			className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 cursor-pointer hover:border-gray-400'
		>
			<input {...getInputProps()} />
			{isDragActive ? (
				<p className='text-gray-600'>Drop the audio file here...</p>
			) : (
				<>
					<p>Drag and drop an audio file here, or click to select</p>
					<p className='text-sm text-gray-400'>
						Supported formats: MP3, WAV, M4A (max 25MB)
					</p>
				</>
			)}
		</div>
	)
}
