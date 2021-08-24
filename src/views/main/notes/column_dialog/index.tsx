import React, { forwardRef, useState, useEffect } from 'react'
import './styles.css'
import NoteColumnDialogProps from './props'
import NoteColumnConstants from '../../../../constants/note/NoteColumnConstants'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'
import { useLanguage } from '../../../../context/language'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { DinoTextfield } from '../../../../components/textfield'

const NoteColumnDialog = forwardRef(
	(props: NoteColumnDialogProps, ref: React.Ref<JSX.Element>): JSX.Element => {
		const language = useLanguage()

		const [newTitle, setNewTitle] = useState<string>(
			props.column ? props.column.title : '',
		)
		const [invalidMessage, setInvalidMessage] = useState<string>()

		useEffect(() => {
			setNewTitle(props.column ? props.column.title : '')
		}, [props.open, props.column])

		const handleSave = async () => {
			const invalidTitle = !isTitleValid(newTitle)

			if (invalidTitle) {
				return
			}

			if (props.column) {
				if (props.column.title !== newTitle) {
					const oldTitle = props.column.title
					props.column.title = newTitle
					props.onSave(props.column, oldTitle)
				} else {
					props.onClose()
				}
			} else if (props.order !== undefined) {
				const newColumn: NoteColumnEntity = {
					title: newTitle,
					order: props.order,
				}
				props.onSave(newColumn)
			}
		}

		const handleTitleChange = (newTitle: string) => {
			setNewTitle(newTitle.substring(0, NoteColumnConstants.TITLE_MAX))
		}

		const isTitleValid = (title: string): boolean => {
			const unchangedTitle = props.column && props.column.title === title
			if (unchangedTitle) {
				return true
			}

			const minLengthError = title.length < NoteColumnConstants.TITLE_MIN
			if (minLengthError) {
				setInvalidMessage(language.data.COLUMN_MIN_LENGTH_ERROR)
				return false
			}

			const titleConflict = props.titleAlreadyExists(title)
			if (titleConflict) {
				setInvalidMessage(language.data.itemAlreadyExists(language.data.TITLE))
				return false
			}

			setInvalidMessage(undefined)
			return true
		}

		return (
			<DinoDialog open={props.open} onSave={handleSave} onClose={props.onClose}>
				<div className='note__column_dialog__content'>
					<DinoTextfield
						value={newTitle}
						onChange={e => handleTitleChange(e.target.value)}
						errorMessage={invalidMessage}
						label={`${language.data.COLUMN_TITLE_LABEL}`}
						dataProps={DataConstants.NOTE_COLUMN_NAME}
					/>
				</div>
			</DinoDialog>
		)
	},
)

export default NoteColumnDialog
