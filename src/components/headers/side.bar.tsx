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

const testChats = [
	{
		title: 'Test chat 1',
		url: '/chat/1',
	},
	{
		title: 'Test chat 2',
		url: '/chat/2',
	},
	{
		title: 'Test chat 3',
		url: '/chat/3',
	},
	{
		title: 'Test chat 4',
		url: '/chat/4',
	},
	{
		title: 'Test chat 5',
		url: '/chat/5',
	},
	{
		title: 'Test chat 6',
		url: '/chat/6',
	},
]

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
		fetchRecords()
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
								{records.map(item => (
									<SidebarMenuItem key={item.id}>
										<SidebarMenuButton asChild>
											<Link href={`/record/${item.id}`}>
												<Diamond />
												<span>{item.text.slice(0, 25)}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
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
