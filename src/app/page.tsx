import FileDropZone from '@/components/dropzone'

export default function Home() {
	return (
		<div className='flex flex-col gap-4 w-screen h-screen items-center justify-center'>
			<h1 className='text-4xl font-bold'>Voice to Text</h1>
			<FileDropZone />
		</div>
	)
}
