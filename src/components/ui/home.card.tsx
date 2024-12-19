import { ReactNode } from 'react'

const HomeCard = ({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<div
			className={`flex px-2 py-4 overflow-hidden hover:bg-[var(--glass-bg-hover)] transition-all duration-200 w-full h-full place-content-center rounded-xl glass ${className} border`}
		>
			{children}
		</div>
	)
}

export default HomeCard
