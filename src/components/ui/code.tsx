import { Space_Mono } from 'next/font/google'
import { ReactNode } from 'react'

const MonoSpace = Space_Mono({ weight: '400', subsets: ['latin'] })

const CodeCard = ({ children }: { children: ReactNode }) => {
	return (
		<div className={`flex glass rounded-xl px-1 py-2 ${MonoSpace.className}`}>
			{children}
		</div>
	)
}

export default CodeCard
