import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { Buffer } from 'node:buffer'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const SUPPORTED_FORMATS = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg']

export async function POST(req: Request) {
	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		return NextResponse.json(
			{ error: 'BLOB_READ_WRITE_TOKEN is required' },
			{ status: 401 }
		)
	}

	// Получаем файл из тела запроса
	const formData = await req.formData()
	const file = formData.get('file')

	if (!file || !(file instanceof Blob)) {
		return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
	}

	// Получаем тип файла и его размер
	const contentType = file.type
	const fileSize = file.size

	// Проверяем тип файла
	if (!SUPPORTED_FORMATS.includes(contentType)) {
		return NextResponse.json(
			{ error: 'Unsupported file format. Supported formats: MP3, WAV, M4A' },
			{ status: 400 }
		)
	}

	// Проверяем размер файла
	if (fileSize > MAX_FILE_SIZE) {
		return NextResponse.json(
			{ error: 'File size exceeds the 5MB limit' },
			{ status: 400 }
		)
	}

	// Получаем имя файла
	const filename = formData.get('filename')?.toString() || 'file.txt'
	const fileType = contentType.split('/')[1]
	const finalName = filename.includes(`.${fileType}`)
		? filename
		: `${filename}.${fileType}`

	// Читаем файл как Buffer
	const buffer = Buffer.from(await file.arrayBuffer())

	// Загружаем файл в Blob Storage
	try {
		const blob = await put(finalName, buffer, {
			contentType,
			access: 'public',
		})

		return NextResponse.json({ blob })
	} catch (error) {
		console.error('Error uploading file:', error)
		return NextResponse.json(
			{ error: 'Error uploading file to blob storage' },
			{ status: 500 }
		)
	}
}
