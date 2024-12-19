'use client'

import {
	Diamond,
	DiamondPlus,
	Gem,
	GemIcon,
	Loader,
	RotateCcw,
	Settings,
} from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
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
	{
		title: 'Premium',
		url: '/premium',
		icon: GemIcon,
		gold: true,
	},
]

export function AppSidebar({ children }: { children: React.ReactNode }) {
	const { records, fetchRecords, loading } = useRecords()

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
						<SidebarGroupAction
							title='Reload records'
							onClick={() => fetchRecords()}
						>
							<RotateCcw /> <span className='sr-only'>Reload records</span>
						</SidebarGroupAction>
						<SidebarGroupContent>
							<SidebarMenu>
								{loading ? (
									<SidebarMenuButton>
										<Loader />
										<span>loading</span>
									</SidebarMenuButton>
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
