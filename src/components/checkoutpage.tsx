'use client'

import convertToSubcurrency from '@/lib/convertToSubcurrency'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

const CheckoutPage = ({ amount }: { amount: number }) => {
	const stripe = useStripe()
	const elements = useElements()
	const [errorMessage, setErrorMessage] = useState<string>()
	const [clientSecret, setClientSecret] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		fetch('/api/create-payment-intent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
		})
			.then(res => res.json())
			.then(data => setClientSecret(data.clientSecret))
	}, [amount])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLoading(true)

		if (!stripe || !elements) {
			return
		}

		const { error: submitError } = await elements.submit()

		if (submitError) {
			setErrorMessage(submitError.message)
			setLoading(false)
			return
		}

		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret,
			confirmParams: {
				return_url: `${process.env.LINK}/payment-success?amount=${amount}`,
			},
		})

		if (error) {
			setErrorMessage(error.message)
		} else {
			// The payment has been processed!
			setErrorMessage('Something went wrong')
		}

		setLoading(false)
	}

	if (!clientSecret || !stripe || !elements) {
		return (
			<div className='flex items-center justify-center'>
				<div
					className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white'
					role='status'
				>
					<span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
						Loading...
					</span>
				</div>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className='p-2 w-1/3 bg-white rounded-md'>
			{clientSecret && <PaymentElement />}

			{errorMessage && <div className='text-black'>{errorMessage}</div>}

			<Button
				disabled={!stripe || loading}
				variant={'outline'}
				className='w-full p-5  mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse'
			>
				{!loading ? `Pay $${amount}` : 'Processing...'}
			</Button>
		</form>
	)
}

export default CheckoutPage