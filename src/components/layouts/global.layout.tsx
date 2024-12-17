import { ThemeProvider } from 'next-themes'
import { AppSidebar } from '../headers/side.bar'
import { ClerkModifiedProvider } from '../providers/clerk.provider'
import { Toaster } from '../ui/toaster'

export function GlobalLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
			disableTransitionOnChange
		>
			<ClerkModifiedProvider>
				<AppSidebar>
					{children}
					<Toaster />
				</AppSidebar>
			</ClerkModifiedProvider>
		</ThemeProvider>
	)
}
