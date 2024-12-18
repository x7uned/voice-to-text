'use client'

import { Diamond, DiamondPlus, Gem, Settings } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRecords } from '../contexts/records.context'

const items = [
	{
		title: 'Create new chat',
		url: '/',
		icon: DiamondPlus,
	},
	{
		title: 'Settings',
		url: '/settings',
		icon: Settings,
	},
	{
		title: 'Upgrade',
		url: '/upgrade',
		icon: Gem,
		gold: true,
	},
]

export function AppSidebar({ children }: { children: React.ReactNode }) {
	const { records, fetchRecords } = useRecords()
	const [loading, setLoading] = useState(true)

	const fetchingRecords = () => {
		try {
			fetchRecords()
		} catch (error) {
			console.error('Error fetching records:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchingRecords()
	}, [])

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Application</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{items.map(item => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											className={item.gold ? 'text-yellow-500' : ''}
											asChild
										>
											<a href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel>Records</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu>
								{loading ? (
									<SidebarMenuButton>Loading...</SidebarMenuButton>
								) : (
									records.map(item => (
										<SidebarMenuItem key={item.id}>
											<SidebarMenuButton asChild>
												<Link href={`/record/${item.id}`}>
													<Diamond />
													<span>{item.text.slice(0, 40)}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem className='flex justify-center'>
							<SignedOut>
								<SignInButton>
									<SidebarMenuButton
										size='lg'
										className='flex justify-center text-xl'
									>
										Sign in
									</SidebarMenuButton>
								</SignInButton>
							</SignedOut>
							<SignedIn>
								<UserButton showName />
							</SignedIn>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarTrigger className='ml-4 mt-2' />
			{children}
		</SidebarProvider>
	)
}
