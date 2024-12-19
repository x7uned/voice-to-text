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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const response = await axios.post('/api/checkout_sessions')

		if (response.data.session) {
			router.push(response.data.session)
		}
	}

	return (
		<div className='flex justify-center items-center w-screen h-screen'>
			<form onSubmit={handleSubmit}>
				<section>
					<Button type='submit' variant='outline'>
						Checkout
					</Button>
				</section>
			</form>
		</div>
	)
}
