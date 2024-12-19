import { GlobalLayout } from '@/components/layouts/global.layout'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Voice to text app',
	description: 'Powered by x7uned',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${inter.className} antialiased`}>
				<GlobalLayout>
					<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
				</GlobalLayout>
			</body>
		</html>
	)
}
