import NoteEntity from '../../../../types/note/database/NoteEntity'

export default interface NoteFormProps {
	note: NoteEntity
	open: boolean
	tagOptions: string[]
	onSave: (question: string, answer: string, tagList: string[]) => void
	onDelete: () => void
	onClose: () => void
	questionAlreadyExists: (question: string, localId?: number) => boolean
}
