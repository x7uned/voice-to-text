'use client'

import { getMyRecords } from '@/lib/records'
import { Record } from '@prisma/client'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

// Типы контекста
interface RecordsContextType {
	records: Record[]
	fetchRecords: () => void
	loading: boolean
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined)

export const useRecords = (): RecordsContextType => {
	const context = useContext(RecordsContext)
	if (!context) {
		throw new Error('useRecords must be used within a RecordsProvider')
	}
	return context
}

export const RecordsProvider = ({ children }: { children: ReactNode }) => {
	const [records, setRecords] = useState<Record[]>([])
	const [loading, setLoading] = useState(false)

	const fetchRecords = async () => {
		try {
			setLoading(true)
			const response = await getMyRecords()
			if (response.records && response.success) {
				setRecords(response.records)
			}
		} catch (error) {
			console.error('Error fetching records:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchRecords() // Загружаем записи при монтировании компонента
	}, [])

	return (
		<RecordsContext.Provider value={{ records, fetchRecords, loading }}>
			{children}
		</RecordsContext.Provider>
	)
}
