import { SignIn } from '@clerk/nextjs'

export default function Page() {
	return (
		<div className='flex w-screen h-screen items-center justify-center'>
			<SignIn />
		</div>
	)
}
