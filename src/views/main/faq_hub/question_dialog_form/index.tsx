import React, { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core'
import QuestionDialogFormProps from './props'
import Constants from '../../../../constants/app_data/DataConstants'
import TreatmentQuestionEntity from '../../../../types/faq/database/TreatmentQuestionEntity'
import TreatmentQuestionService from '../../../../services/treatment/TreatmentQuestionService'
import { useLanguage } from '../../../../context/language'
import DinoDialog, { DinoDialogContent, DinoDialogHeader } from '../../../../components/dialogs/dino_dialog'
import StringUtils from '../../../../utils/StringUtils'
import './styles.css'

const QuestionDialogForm: React.FC<QuestionDialogFormProps> = ({ dialogOpen, onClose, treatment }) => {
	const language = useLanguage()
	const [question, setQuestion] = useState('')
	const [error, setError] = useState(false)

	const handleSave = () => {
		if (question !== '') {
			const entity: TreatmentQuestionEntity = {
				question: question,
				localTreatmentId: treatment.localId
			}
			TreatmentQuestionService.save(entity)
			onClose()
		} else if (StringUtils.isEmpty(question)) {
			setError(true)
		}
	}

	useEffect(() => {
		if (!dialogOpen) {
			return () => {
				setQuestion('')
				setError(false)
			}
		}
	}, [dialogOpen])

	const getHelperText = () => (error && language.data.EMPTY_FIELD_ERROR) || `${question.length}/${Constants.FAQ_QUESTION.MAX}`

	return (
		<div className='dialog-form'>
			<DinoDialog
				open={dialogOpen}
				onSave={handleSave}
				onClose={onClose}
				header={
					<DinoDialogHeader>
						{language.data.titleTreatmentQuestion(treatment.name)}
					</DinoDialogHeader>
				}
			>
				<DinoDialogContent>
					<p style={{ 'margin': '0' }}>{language.data.SEND_TO_THE_PROFESSIONALS}</p>
					<TextField
						className='dino__textfield'
						required={Constants.FAQ_QUESTION.REQUIRED}
						fullWidth
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						autoFocus
						margin='dense'
						label={language.data.FORM_QUESTION}
						placeholder={language.data.FORM_QUESTION_PLACEHOLDER}
						type='question'
						multiline
						rowsMax={10}
						inputProps={{ maxLength: Constants.FAQ_QUESTION.MAX }}
						helperText={getHelperText()}
						error={error}
					/>
				</DinoDialogContent>
			</DinoDialog>
		</div>
	)
}

export default QuestionDialogForm
