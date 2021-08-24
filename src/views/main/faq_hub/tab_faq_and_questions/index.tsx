import React from 'react'
import Faq from '../faq'
import DinoTabPanel from '../../../../components/tab_panel'
import { useLanguage } from '../../../../context/language'
import TreatmentQuestionItems from '../treatment_question_list_items'
import { useParams } from 'react-router-dom'
import FaqView from '../../../../types/faq/view/FaqView'

const FaqAndUserQuestions: React.FC<{ view?: FaqView }> = ({ view }) => {
	const language = useLanguage()

	const params = useParams<{ localId?: string; tab?: string }>()

	const panels = [
		{ Label: language.data.FAQ, Component: <Faq view={view} /> },
		{ Label: language.data.QUESTIONS, Component: <TreatmentQuestionItems /> },
	]

	const intTab = params.tab ? parseInt(params.tab) : 0
	const currentTab = intTab >= 0 && intTab < panels.length ? intTab : 0

	return <DinoTabPanel currentTab={currentTab} panels={panels} />
}

export default FaqAndUserQuestions
