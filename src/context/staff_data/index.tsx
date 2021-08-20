import React, { createContext, useContext, useEffect, useState } from 'react'
import TreatmentQuestionService from '../../services/treatment/TreatmentQuestionService'
import TreatmentService from '../../services/treatment/TreatmentService'
import TreatmentQuestionEntity from '../../types/faq/database/TreatmentQuestionEntity'
import TreatmentView from '../../types/faq/view/TreatmentView'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import { hasValue } from '../../utils/Utils'

/**
 * @description Contexto padrão para os dados de staff
 */
const StaffData = createContext(new Map<number, TreatmentView>())

/**
 * @description Gera os dados necessários para as rotas privadas e de login
 * @param children filho do StaffData
 */
const StaffDataProvider: React.FC = ({ children }) => {
	const [value, setValue] = useState(new Map<number, TreatmentView>())

	useEffect(() => {
		const loadData = async () => {
			const treatmentQuestions = await TreatmentQuestionService.getAll()

			const treatments = await TreatmentService.getAll()

			const treatmentMap = new Map<number, TreatmentView>()

			populateMapWithTreatments(treatments, treatmentMap)

			populateMapWithQuestions(treatmentQuestions, treatmentMap)

			setValue(treatmentMap)
		}

		const populateMapWithTreatments = (
			treatments: TreatmentEntity[],
			treatmentMap: Map<number, TreatmentView>,
		) => {
			treatments.forEach(
				t =>
					hasValue(t.localId) && treatmentMap.set(t.localId!, { treatment: t }),
			)
		}

		const populateMapWithQuestions = (
			treatmentQuestions: TreatmentQuestionEntity[],
			treatmentMap: Map<number, TreatmentView>,
		) => {
			const pushQuestionToTreatment = (
				localTreatmentId: number,
				tq: TreatmentQuestionEntity,
			) => {
				const treatment = treatmentMap.get(localTreatmentId)
				if (treatment)
					treatment.questions
						? treatment.questions.push(tq)
						: (treatment.questions = [tq])
			}

			treatmentQuestions.forEach(tq => {
				const localTreatmentId = tq.localTreatmentId
				if (localTreatmentId && treatmentMap.has(localTreatmentId)) {
					pushQuestionToTreatment(localTreatmentId, tq)
				}
			})
		}

		loadData()

		TreatmentQuestionService.addUpdateEventListenner(loadData)
		return () => TreatmentQuestionService.removeUpdateEventListenner(loadData)
	}, [])

	return <StaffData.Provider value={value}>{children}</StaffData.Provider>
}

export const useStaffData = () => useContext(StaffData)

export const useTreatmentView = (
	treatmentLocalId?: number,
): TreatmentView | undefined => {
	const staffData = useStaffData()
	return treatmentLocalId ? staffData.get(treatmentLocalId) : undefined
}

export default StaffDataProvider
