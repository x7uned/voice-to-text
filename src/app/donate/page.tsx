'use client'

import CheckoutPage from '@/components/checkoutpage'
import { Button } from '@/components/ui/button'
import convertToSubcurrency from '@/lib/convertToSubcurrency'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function UpgradePage() {
	const [value, setValue] = useState(1)

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
					onClick={() => setValue(1)}
					variant={value === 1 ? 'default' : 'outline'}
					className='w-full'
				>
					1$
				</Button>
				<Button
					onClick={() => setValue(5)}
					variant={value === 5 ? 'default' : 'outline'}
					className='w-full'
				>
					5$
				</Button>
				<Button
					onClick={() => setValue(10)}
					variant={value === 10 ? 'default' : 'outline'}
					className='w-full'
				>
					10$
				</Button>
				<Button
					onClick={() => setValue(20)}
					variant={value === 20 ? 'default' : 'outline'}
					className='w-full'
				>
					20$
				</Button>
			</div>

			<Elements
				stripe={stripePromise}
				options={{
					mode: 'payment',
					amount: convertToSubcurrency(value),
					currency: 'usd',
				}}
			>
				<CheckoutPage amount={value} />
			</Elements>
		</main>
	)
}
