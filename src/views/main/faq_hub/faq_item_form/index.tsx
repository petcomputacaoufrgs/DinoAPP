import { Checkbox, FormControlLabel } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DinoDialog, {
	DinoDialogContent,
} from '../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import FaqItemService from '../../../../services/faq/FaqItemService'
import TreatmentQuestionService from '../../../../services/treatment/TreatmentQuestionService'
import FaqItemEntity from '../../../../types/faq/database/FaqItemEntity'
import TreatmentQuestionEntity from '../../../../types/faq/database/TreatmentQuestionEntity'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import StringUtils from '../../../../utils/StringUtils'

interface FaqItemFormProps {
	open: boolean
	onClose: () => void
	treatment: TreatmentEntity
	faqItem?: FaqItemEntity
	treatmentQuestion?: TreatmentQuestionEntity
}

const FaqItemForm: React.FC<FaqItemFormProps> = ({
	open,
	onClose,
	treatment,
	faqItem,
	treatmentQuestion,
}) => {
	const getItem = (): FaqItemEntity =>
		faqItem || {
			question: treatmentQuestion?.question || '',
			answer: '',
			localTreatmentId: treatment.localId,
			isUniversal: DataConstants.FALSE,
		}

	const [item, setItem] = useState<FaqItemEntity>(getItem())

	useEffect(() => {
		if (open) setItem(getItem())
	}, [open])

	const [errorQuestion, setErrorQuestion] = useState<string>()
	const [errorAnswer, setErrorAnswer] = useState<string>()

	const language = useLanguage()

	const handleSave = () => {
		const isValid = () => {
			if (StringUtils.isEmpty(item.question)) {
				setErrorQuestion(language.data.EMPTY_FIELD_ERROR)
				return false
			}
			if (StringUtils.isEmpty(item.answer)) {
				setErrorAnswer(language.data.EMPTY_FIELD_ERROR)
				return false
			}
			return true
		}

		if (isValid()) {
			FaqItemService.save(item)

			if (treatmentQuestion)
				//caso seja uma pergunta feita por um usuário, a deleta pois foi respondida
				TreatmentQuestionService.delete(treatmentQuestion)

			onClose()
		}
	}

	const handleChangeUniversal = (
		event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean,
	) => {
		item.localTreatmentId = checked ? undefined : treatment.localId
		item.isUniversal = Number(checked) as 0 | 1
		console.log('changed', item)
		setItem({ ...item })
	}

	return (
		<DinoDialog
			className='faq_item__form'
			open={open}
			onClose={onClose}
			onSave={handleSave}
		>
			<DinoDialogContent>
				<DinoTextfield
					dataProps={DataConstants.FAQ_QUESTION}
					multiline
					rowsMax={10}
					label={language.data.FORM_QUESTION}
					value={item.question}
					onChange={e => setItem({ ...item, question: e.target.value })}
					errorMessage={errorQuestion}
				/>
				<DinoTextfield
					multiline
					rowsMax={10}
					label={language.data.FORM_ANSWER}
					dataProps={DataConstants.FAQ_ANSWER}
					value={item.answer}
					onChange={e => setItem({ ...item, answer: e.target.value })}
					errorMessage={errorAnswer}
				/>
				<hr />
				<FormControlLabel
					label={language.data.SHOW_FAQ_ITEM_IN_ALL_FAQS_LABEL}
					control={
						<Checkbox
							checked={Boolean(item.isUniversal)}
							onChange={handleChangeUniversal}
						/>
					}
				/>
			</DinoDialogContent>
		</DinoDialog>
	)
}

export default FaqItemForm
