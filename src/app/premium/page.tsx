'use client'

import LoadingScreen from '@/components/loading.screen'
import { Button } from '@/components/ui/button'
import HomeCard from '@/components/ui/home.card'
import { doIHavePremium } from '@/lib/users'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error('Missing env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

export default function PreviewPage() {
	const router = useRouter()
	const [premium, setPremium] = React.useState(false)
	const [loading, setLoading] = React.useState(true)

	const fetchPremium = async () => {
		const response = await doIHavePremium()

		if (response) {
			setPremium(true)
		}

		setLoading(false)
	}

	React.useEffect(() => {
		fetchPremium()
	}, [])

	if (loading) {
		return <LoadingScreen />
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const response = await axios.post('/api/checkout_sessions')

		if (response.data.session) {
			router.push(response.data.session)
		}
	}

	if (premium) {
		return (
			<div className='flex justify-center items-center w-screen h-screen text-3xl text-yellow-400'>
				<p>{'Congratulations! You already have premium!'}</p>
			</div>
		)
	}

	return (
		<div className='flex justify-center items-center w-screen h-screen'>
			<form onSubmit={handleSubmit}>
				<section>
					<HomeCard className='border-[#ffc66486]'>
						<div className='flex w-full flex-col gap-2 items-center justify-between'>
							<p className='text-4xl'>PREMIUM</p>
							<div className='flex flex-col items-center'>
								<ul className='flex flex-col mt-2 items-start px-8 w-full list-disc'>
									<li className='text-sectext'>Unlimited Uploads</li>
									<li className='text-sectext'>Unlimited Voice-to-text</li>
									<li className='text-sectext'>No AD</li>
								</ul>
							</div>
							<Button>Buy now</Button>
						</div>
					</HomeCard>
				</section>
			</form>
		</div>
	)
}
