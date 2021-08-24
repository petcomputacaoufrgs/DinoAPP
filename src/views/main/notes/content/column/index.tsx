import React from 'react'
import NoteBodyColumnProps from './props'
import './styles.css'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import NoteContentColumnCard from './card'
import NoteBodyColumnHeader from './header'
import NoteDraggableType from '../../../../../constants/note/NoteDroppableType'
import NotesContentColumnAddNote from './add_note'
import NoteEntity from '../../../../../types/note/database/NoteEntity'

const NoteContentColumn: React.FC<NoteBodyColumnProps> = ({
	noteView,
	columnIndex,
	searching,
	onClickNote,
	onEditColumn,
	onDeleteColumn,
	onAddNote,
}) => {
	const renderCard = (
		note: NoteEntity,
		columnIndex: number,
		noteIndex: number,
	): JSX.Element | undefined => {
		return (
			<NoteContentColumnCard
				searching={searching}
				note={note}
				key={noteIndex}
				noteIndex={noteIndex}
				columnIndex={columnIndex}
				onClickNote={onClickNote}
			></NoteContentColumnCard>
		)
	}

	const handleColumnEdit = () => {
		onEditColumn(noteView.column)
	}

	const handleColumnDelete = () => {
		onDeleteColumn(noteView.column)
	}

	const handleAddNote = () => {
		onAddNote(noteView.column)
	}

	return (
		<div className={`note__note_content__column`}>
			<Draggable
				draggableId={columnIndex.toString()}
				index={columnIndex}
				isDragDisabled={searching}
			>
				{provided => (
					<div
						className='note__note_content__column__draggable'
						{...provided.draggableProps}
						ref={provided.innerRef}
					>
						<div
							className='note__note_content__column__draggable__title'
							{...provided.dragHandleProps}
							data-dino-draggable={true}
						>
							<NoteBodyColumnHeader
								title={noteView.column.title}
								onEdit={handleColumnEdit}
								onDelete={handleColumnDelete}
							/>
						</div>
						<Droppable
							droppableId={noteView.column.title}
							type={NoteDraggableType.NOTE}
						>
							{provided => (
								<div
									className='note__note_content__column__draggable__droppable'
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<div className='note__note_content__column__draggable__droppable__scroll'>
										{noteView.notes.map((note, index) =>
											renderCard(note, columnIndex, index),
										)}
									</div>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						<div className='note__note_content__column__draggable__add_button'>
							<NotesContentColumnAddNote
								notesCount={noteView.notes.length}
								onAdd={handleAddNote}
							/>
						</div>
					</div>
				)}
			</Draggable>
		</div>
	)
}

export default NoteContentColumn
