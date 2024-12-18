import { ThemeProvider } from 'next-themes'
import { RecordsProvider } from '../contexts/records.context'
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
				<RecordsProvider>
					<AppSidebar>
						{children}
						<Toaster />
					</AppSidebar>
				</RecordsProvider>
			</ClerkModifiedProvider>
		</ThemeProvider>
	)
}
