'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { transcribe } from '@/lib/transcribe'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AlertDialogFooter, AlertDialogHeader } from './ui/alert-dialog'

export default function FileDropZone() {
	const { toast } = useToast()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [open, setOpen] = useState(false)

	const onFileUpload = useCallback(
		async (file: File) => {
			try {
				setLoading(true)

				const formData = new FormData()
				formData.append('file', file)

				const response = await axios.post('/api/upload/audio', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				if (response.data.blob.url) {
					const fetch = await transcribe(response.data.blob.url)

					if (fetch?.success) {
						router.push(`/record/${fetch.id}`)
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
			} catch (error: unknown) {
				console.log(error)
				if (axios.isAxiosError(error) && error.status === 412) {
					setOpen(true)
				} else {
					toast({
						title: 'Upload error',
						description: 'Unable to upload file. Please try again later.',
						variant: 'destructive',
					})
				}
			} finally {
				setLoading(false)
			}
		},
		[toast, router]
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

	if (loading) {
		return <div className='loader'></div>
	}

	return (
		<AlertDialog open={open}>
			<div
				{...getRootProps()}
				className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 cursor-pointer hover:border-gray-400'
			>
				<input {...getInputProps()} />
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
			</div>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>You're over the limit</AlertDialogTitle>
					<AlertDialogDescription>
						To do more voice - text you need to buy premium. Do you want it?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							router.push('/premium')
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
