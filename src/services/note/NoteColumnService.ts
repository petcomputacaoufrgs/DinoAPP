import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import Database from '../../storage/Database'
import PermissionEnum from '../../types/enum/PermissionEnum'
import NoteColumnDataModel from '../../types/note/api/NoteColumnDataModel'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../types/note/database/NoteEntity'
import NoteView from '../../types/note/view/NoteView'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import NoteService from './NoteService'

class NoteColumnServiceImpl extends AutoSynchronizableService<
	number,
	NoteColumnDataModel,
	NoteColumnEntity
> {
	constructor() {
		super(
			Database.noteColumn,
			APIHTTPPathsConstants.NOTE_COLUMN,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.NOTE_COLUMN,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	async convertModelToEntity(
		model: NoteColumnDataModel,
	): Promise<NoteColumnEntity> {
		const entity: NoteColumnEntity = {
			order: model.order,
			title: model.title,
		}

		return entity
	}

	async convertEntityToModel(
		entity: NoteColumnEntity,
	): Promise<NoteColumnDataModel> {
		const model: NoteColumnDataModel = {
			order: entity.order,
			title: entity.title,
		}

		return model
	}

	hasNotesInColumn(notes: NoteEntity[], column: NoteColumnEntity) {
		return notes.some(note => note.columnLocalId === column.localId)
	}

	getNotesInColumn(notes: NoteEntity[], column: NoteColumnEntity) {
		return notes.filter(note => note.columnLocalId === column.localId)
	}

	getNoteViews = (notes: NoteEntity[], columns: NoteColumnEntity[]) => {
		return columns
			.sort((c1, c2) => c1.order - c2.order)
			.map(column => {
				const columnNotes = notes
					.filter(note => note.columnLocalId === column.localId)
					.sort((n1, n2) => n1.order - n2.order)

				return {
					column: column,
					notes: columnNotes,
				}
			})
	}

	filterNoteViews(
		noteViews: NoteView[],
		tagsSearch: string[],
		textSearch: string,
	): NoteView[] {
		const filteredColumns: NoteView[] = []
		const activeTagsSearch = tagsSearch.length > 0
		const activeTextSearch = textSearch !== undefined && textSearch.length !== 0
		const showAllColumns = !activeTagsSearch && !activeTextSearch

		noteViews
			.sort((c1, c2) => c1.column.order - c2.column.order)
			.forEach(noteView => {
				const filteredNotes = NoteService.filterNotesInNoteView(
					noteView,
					tagsSearch,
					textSearch,
					activeTagsSearch,
					activeTextSearch,
				)

				if (filteredNotes.length > 0 || showAllColumns) {
					filteredColumns.push({
						column: noteView.column,
						notes: filteredNotes.sort((n1, n2) => n1.order - n2.order),
					})
				}
			})

		return filteredColumns
	}
}

export default new NoteColumnServiceImpl()
