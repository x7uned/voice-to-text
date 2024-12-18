import FileDropZone from '@/components/dropzone'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

export default function Home() {
	return (
		<div className='flex flex-col gap-5 w-screen h-screen items-center justify-center'>
			<h1 className='text-4xl font-bold'>Voice to Text</h1>
			<SignedIn>
				<FileDropZone />
			</SignedIn>
			<SignedOut>
				<SignInButton>
					<Button size='lg' className='flex justify-center text-xl'>
						Sign in
					</Button>
				</SignInButton>
			</SignedOut>
		</div>
	)
}
