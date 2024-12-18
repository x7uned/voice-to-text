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

	const fetchRecords = async () => {
		try {
			const response = await getMyRecords()
			if (response.records && response.success) {
				setRecords(response.records)
			}
		} catch (error) {
			console.error('Error fetching records:', error)
		}
	}

	useEffect(() => {
		fetchRecords() // Загружаем записи при монтировании компонента
	}, [])

	return (
		<RecordsContext.Provider value={{ records, fetchRecords }}>
			{children}
		</RecordsContext.Provider>
	)
}
