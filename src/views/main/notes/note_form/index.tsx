import React, { useState, useEffect } from 'react'
import NoteFormProps from './props'
import DateUtils from '../../../../utils/DateUtils'
import NoteConstants from '../../../../constants/note/NoteConstants'
import AgreementDialog from '../../../../components/dialogs/agreement_dialog'
import { useLanguage } from '../../../../context/language'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import './styles.css'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { DinoTextfield } from '../../../../components/textfield'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import StringUtils from '../../../../utils/StringUtils'
import { NoteTagTextfield } from '../tag_textfield'
import { NoteCardHeader } from '../card_header'

const NoteForm: React.FC<NoteFormProps> = ({
	note,
	open,
	tagOptions,
	onSave,
	onClose,
	onDelete,
	questionAlreadyExists,
}) => {
	const language = useLanguage()

	const [question, setQuestion] = useState(note.question)
	const [answer, setAnswer] = useState(note.answer)
	const [tagList, setTagList] = useState(note.tags)
	const [errorQuestionMessage, setErrorQuestionMessage] = useState<string>()
	const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = useState(false)

	useEffect(() => {
		setAnswer(note.answer)
		setQuestion(note.question)
		setTagList(note.tags)
	}, [note])

	const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
		if (values.length <= NoteConstants.TAG_LIMIT) {
			setTagList(values)
		}
	}

	const handleSaveNote = () => {
		if (isValidData()) onSave(question, answer, tagList)
	}

	const handleDeleteNoteAgree = () => {
		onDelete()
		setDeleteNoteDialogOpen(false)
	}

	const handleDeleteNoteDisagree = () => {
		setDeleteNoteDialogOpen(false)
	}

	const handleDeleteNote = () => {
		setDeleteNoteDialogOpen(true)
	}

	const isValidData = () => {
		if (StringUtils.isEmpty(question)) {
			setErrorQuestionMessage(language.data.EMPTY_FIELD_ERROR)
			return false
		}

		const questionConflict = questionAlreadyExists(question, note.localId)

		if (questionConflict) {
			setErrorQuestionMessage(
				language.data.itemAlreadyExists(language.data.QUESTION),
			)
			return false
		}

		setErrorQuestionMessage(undefined)
		return true
	}

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleOpenOptions = (event: React.MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(event.currentTarget)

	return (
		<DinoDialog
			open={open}
			onClose={onClose}
			onSave={handleSaveNote}
			header={
				<NoteCardHeader
					title={question}
					subheader={DateUtils.getDateStringFormated(
						note.lastUpdate!,
						language.data,
					)}
					onClickOptions={handleOpenOptions}
				/>
			}
		>
			<div className='note__info_dialog__content'>
				<DinoTextfield
					className='note__info_dialog__content__question'
					label={`${language.data.QUESTION_NOTE_DIALOG_TITLE}`}
					dataProps={DataConstants.NOTE_QUESTION}
					multiline
					value={question}
					onChange={e => setQuestion(e.target.value)}
					errorMessage={errorQuestionMessage}
				/>
				<DinoTextfield
					className='note__info_dialog__content__answer'
					label={`${language.data.ANSWER_NOTE_DIALOG_TITLE}`}
					dataProps={DataConstants.NOTE_ANSWER}
					multiline
					value={answer}
					onChange={e => setAnswer(e.target.value)}
				/>
				<NoteTagTextfield
					value={tagList}
					onChange={handleTagChange}
					options={tagOptions}
				/>
				<AgreementDialog
					onAgree={handleDeleteNoteAgree}
					onDisagree={handleDeleteNoteDisagree}
					question={language.data.DELETE_NOTE_ALERT_TITLE}
					open={deleteNoteDialogOpen}
				/>
			</div>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onDelete={handleDeleteNote}
			/>
		</DinoDialog>
	)
}

export default NoteForm
