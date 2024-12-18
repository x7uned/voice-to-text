import { randomBytes } from 'crypto'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const SUPPORTED_FORMATS = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg']

export async function POST(request: NextRequest) {
	const data = await request.formData()
	const file: File | null = data.get('file') as unknown as File

	if (!file) {
		return new NextResponse('No file uploaded', { status: 400 })
	}

	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		return new NextResponse('File size exceeds 5MB limit', { status: 400 })
	}

	// Check file type
	console.log(file.type)
	if (!SUPPORTED_FORMATS.includes(file.type)) {
		return new NextResponse(
			'Unsupported file format. Supported formats: MP3, WAV, M4A',
			{ status: 400 }
		)
	}

	// Generate random file name
	const randomName = randomBytes(16).toString('hex')
	const fileExtension = path.extname(file.name)
	const newFileName = `${randomName}${fileExtension}`

	const bytes = await file.arrayBuffer()
	const buffer = Buffer.from(bytes)

	const uploadPath = path.join('./public/uploads/', newFileName)

	// Write file to disk
	await writeFile(uploadPath, buffer)
	console.log(`File uploaded at ${uploadPath}`)

	// Return the link to the uploaded file
	const fileUrl = `/uploads/${newFileName}`
	return new NextResponse(
		JSON.stringify({ message: 'File uploaded', fileUrl }),
		{ status: 200 }
	)
}
