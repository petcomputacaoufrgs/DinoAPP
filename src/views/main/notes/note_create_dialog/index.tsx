import React, { useState, useEffect } from 'react'
import NoteCreateDialogProps from './props'
import NoteConstants from '../../../../constants/note/NoteConstants'
import { useLanguage } from '../../../../context/language'
import './styles.css'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { NoteTagTextfield } from '../tag_textfield'
import { NoteCardHeader } from '../card_header'
import DateUtils from '../../../../utils/DateUtils'

const NoteCreateDialog: React.FC<NoteCreateDialogProps> = ({
	onClose,
	onSave,
	open,
	tagOptions,
	questionAlreadyExists,
}): JSX.Element => {
	const language = useLanguage()

	const [question, setQuestion] = useState('')
	const [errorMessage, setErrorMessage] = useState<string>()

	const [tagList, setTagList] = useState<string[]>([])

	const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
		if (values.length <= NoteConstants.TAG_LIMIT) {
			setTagList(values)
		}
	}

	const handleSave = async () => {
		const newQuestion = question.trim()

		if (newQuestion.length === 0) {
			setErrorMessage(language.data.EMPTY_FIELD_ERROR)
			return
		}

		const questionConflict = questionAlreadyExists(newQuestion)
		if (questionConflict) {
			setErrorMessage(language.data.itemAlreadyExists(language.data.QUESTION))
			return
		}

		onSave(newQuestion, tagList)
	}

	const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value

		const newQuestion = value.substring(0, DataConstants.NOTE_QUESTION.MAX)

		setQuestion(newQuestion)
	}

	useEffect(() => {
		if (open) {
			setTagList([])
			setQuestion('')
			setErrorMessage(undefined)
		}
	}, [open])

	const renderDialogContent = (): JSX.Element => {
		return (
			<div className='note_create__dialog_content'>
				<DinoTextfield
					value={question}
					onChange={handleQuestionChange}
					errorMessage={errorMessage}
					multiline
					label={`${language.data.QUESTION_NOTE_DIALOG_TITLE}`}
					dataProps={DataConstants.NOTE_QUESTION}
				/>
				<NoteTagTextfield
					value={tagList}
					onChange={handleTagChange}
					options={tagOptions}
				/>
			</div>
		)
	}
	return (
		<DinoDialog
			open={open}
			onClose={onClose}
			onSave={handleSave}
			header={
				<NoteCardHeader
					title={language.data.NOTE_EDIT_DIALOG_NEW_NOTE_TITLE}
					subheader={DateUtils.getDateStringFormated(new Date(), language.data)}
				/>
			}
		>
			{renderDialogContent()}
		</DinoDialog>
	)
}

export default NoteCreateDialog
