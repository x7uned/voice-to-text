'use client'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error('Missing env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

export default function PreviewPage() {
	const router = useRouter()
	const [amount, setAmount] = React.useState(1)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// Отправляем только amount, без обертки в 'body'
		const response = await axios.post('/api/donate-money', { amount })

		if (response.data.session) {
			router.push(response.data.session)
		}
	}

	return (
		<main className='flex w-screen gap-5 h-screen items-center justify-center flex-col'>
			<div className='flex justify-center flex-col items-center text-center'>
				<h1 className='text-4xl font-extrabold mb-2'>Support me pls {'<3'}</h1>
				<h2 className='text-lg w-full'>
					Choose your support tier and help me keep this service running
				</h2>
			</div>

			<div className='flex w-1/3 gap-1'>
				<Button
					onClick={() => setAmount(1)}
					variant={amount === 1 ? 'default' : 'outline'}
					className='w-full'
				>
					1$
				</Button>
				<Button
					onClick={() => setAmount(5)}
					variant={amount === 5 ? 'default' : 'outline'}
					className='w-full'
				>
					5$
				</Button>
				<Button
					onClick={() => setAmount(10)}
					variant={amount === 10 ? 'default' : 'outline'}
					className='w-full'
				>
					10$
				</Button>
				<Button
					onClick={() => setAmount(20)}
					variant={amount === 20 ? 'default' : 'outline'}
					className='w-full'
				>
					20$
				</Button>
			</div>

			<form onSubmit={handleSubmit}>
				<Button size='lg' className='mt-5 w-full'>
					Support with {amount}$
				</Button>
			</form>
		</main>
	)
}
