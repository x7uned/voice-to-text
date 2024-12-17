import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/ui/theme.switcher'

const Settings = () => {
	return (
		<div className='flex flex-col gap-1 w-screen h-screen items-center justify-center'>
			<Button>Check Prisma</Button>
			<ThemeSwitcher />
		</div>
	)
}

export default Settings
