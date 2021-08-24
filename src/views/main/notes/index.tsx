import React, { useState, useEffect } from 'react'
import NoteHeader from './header'
import NoteContent from './content'
import { DropResult } from 'react-beautiful-dnd'
import NoteDroppableType from '../../../constants/note/NoteDroppableType'
import NoteEntity from '../../../types/note/database/NoteEntity'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'
import NoteView from '../../../types/note/view/NoteView'
import DinoLoader from '../../../components/loader'
import NoteService from '../../../services/note/NoteService'
import NoteColumnService from '../../../services/note/NoteColumnService'
import './styles.css'

const Notes: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [tags, setTags] = useState<string[]>([])
	const [noteViews, setNoteViews] = useState<NoteView[]>([])
	const [textSearch, setTextSearch] = useState('')
	const [tagSearch, setTagSearch] = useState<string[]>([])
	const [searching, setSearching] = useState(false)

	useEffect(() => {
		const loadData = async () => {
			const notes = await NoteService.getAll()
			const columns = await NoteColumnService.getAll()

			const tags = NoteService.getAllTags(notes)
			const noteView = NoteColumnService.getNoteViews(notes, columns)

			updateData(noteView, tags)

			finishLoading()
		}

		let updateData = (noteViews: NoteView[], tags: string[]) => {
			setNoteViews(noteViews)
			setTags(tags)
		}

		NoteColumnService.addUpdateEventListenner(loadData)
		NoteService.addUpdateEventListenner(loadData)

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			finishLoading = () => {}
			updateData = () => {}
			NoteColumnService.removeUpdateEventListenner(loadData)
			NoteService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	useEffect(() => {
		if (textSearch.length > 0 || tagSearch.length > 0) {
			setSearching(true)
		} else if (searching) {
			setSearching(false)
		}
	}, [searching, textSearch, tagSearch])

	const isUnchanged = (result: DropResult): boolean => {
		const { destination, source } = result

		if (!destination) {
			return true
		}

		const changedColumn = source.droppableId !== destination.droppableId

		const dropedToSamePosition =
			!changedColumn && destination.index === source.index

		return dropedToSamePosition
	}

	//#region Column

	const handleSaveColumn = (item: NoteColumnEntity) => {
		NoteColumnService.save(item)
	}

	const handleDeleteColumn = async (item: NoteColumnEntity) => {
		await NoteService.deleteNotesByColumn(item)
		NoteColumnService.delete(item)
	}

	//#endregion

	//#region Note

	const questionAlreadyExists = (question: string, localId?: number): boolean =>
		noteViews.some(noteView =>
			noteView.notes.some(
				note => note.question === question && localId !== note.localId,
			),
		)

	const handleSaveNewNote = (
		question: string,
		tagList: string[],
		noteView: NoteView,
	) => {
		if (noteView.column.localId) {
			NoteService.save({
				answer: '',
				question: question,
				tags: tagList,
				columnLocalId: noteView.column.localId,
				order: noteView.notes.length,
			})
		}
	}

	const handleSaveNote = (item: NoteEntity) => {
		NoteService.save(item)
	}

	const handleDeleteNote = (item: NoteEntity) => {
		NoteService.delete(item)
	}

	//#endregion

	//#region Drag&Drop

	const handleNoteDragEnd = (result: DropResult) => {
		const { destination, source } = result

		const isNoteUnchaged = isUnchanged(result)

		if (!destination || isNoteUnchaged) {
			return
		}

		const changedColumn = source.droppableId !== destination.droppableId

		const sourceViewNote = noteViews.find(
			item => item.column.title === source.droppableId,
		)

		const destinationViewNote = noteViews.find(
			item => item.column.title === destination.droppableId,
		)

		if (!sourceViewNote || !destinationViewNote) {
			return
		}

		const changedNote = sourceViewNote.notes[source.index]

		sourceViewNote.notes.splice(source.index, 1)

		destinationViewNote.notes.splice(destination.index, 0, changedNote)

		destinationViewNote.notes.forEach((note, index) => {
			note.order = index
			note.columnLocalId = destinationViewNote.column.localId
		})

		if (changedColumn) {
			sourceViewNote.notes.forEach((note, index) => (note.order = index))
			NoteService.saveAll(
				destinationViewNote.notes.concat(sourceViewNote.notes),
			)
		} else {
			NoteService.saveAll(destinationViewNote.notes)
		}
	}

	const handleNoteColumnDragEnd = (result: DropResult) => {
		const { destination, source } = result

		const isColumnUnchaged = isUnchanged(result)

		if (!destination || isColumnUnchaged) {
			return
		}

		const changedColumn = noteViews[source.index]

		noteViews.splice(source.index, 1)
		noteViews.splice(destination.index, 0, changedColumn)

		noteViews.forEach((item, index) => (item.column.order = index))

		NoteColumnService.saveAll(noteViews.map(item => item.column))
	}

	const handleDragEnd = (result: DropResult) => {
		const { type } = result

		if (type === NoteDroppableType.NOTE) {
			handleNoteDragEnd(result)
		} else if (type === NoteDroppableType.COLUMN) {
			handleNoteColumnDragEnd(result)
		}
	}

	//#endregion

	//#region Searching

	const handleTagSearch = (newTagSearch: string[]) => {
		setTagSearch(newTagSearch)
	}

	const handleTextSearch = (newTextSearch: string) => {
		setTextSearch(newTextSearch)
	}

	//#endregion

	return (
		<div className='notes'>
			<DinoLoader className='notes__loader' isLoading={isLoading}>
				<NoteHeader
					onTagSearch={handleTagSearch}
					onTextSearch={handleTextSearch}
					tags={tags}
				/>
				<NoteContent
					onDragEnd={handleDragEnd}
					onDeleteNote={handleDeleteNote}
					onSaveColumn={handleSaveColumn}
					onDeleteColumn={handleDeleteColumn}
					onSaveNewNote={handleSaveNewNote}
					onSaveNote={handleSaveNote}
					questionAlreadyExists={questionAlreadyExists}
					noteViews={noteViews}
					tags={tags}
					searching={searching}
					tagSearch={tagSearch}
					textSearch={textSearch}
				/>
			</DinoLoader>
		</div>
	)
}

export default Notes
