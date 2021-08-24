import React from 'react'
import NoteBodyColumnHeaderProps from './props'
import './styles.css'
import OptionsIconButton from '../../../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../../../components/list_components/item_list_menu'

const NoteBodyColumnHeader: React.FC<NoteBodyColumnHeaderProps> = ({
	title,
	onEdit,
	onDelete,
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleOpenOptions = (event: React.MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(event.currentTarget)

	return (
		<div className='note__note_content__column__column_header'>
			<h2>{title}</h2>
			<div className='note__note_content__column__column_header__button_div'>
				<OptionsIconButton onClick={handleOpenOptions} />
			</div>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</div>
	)
}

export default NoteBodyColumnHeader
