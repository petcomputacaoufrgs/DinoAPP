import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import ItemListMenuProps from './props'
import { useLanguage } from '../../../context/language'
import './styles.css'

const ItemListMenu = ({
	anchor,
	setAnchor,
	onEdit,
	onDelete,
	onCloseDialog,
	disable,
	editText,
	hideEdit,
}: ItemListMenuProps) => {
	const language = useLanguage()

	const handleClose = () => {
		setAnchor(null)
	}

	const handleCloseDialog = () => {
		if (onCloseDialog) onCloseDialog()
	}

	const handleEdit = () => {
		if (onEdit) {
			handleClose()
			handleCloseDialog()
			onEdit()
		}
	}

	const handleDelete = () => {
		handleClose()
		handleCloseDialog()
		onDelete()
	}

	return (
		<Menu
			anchorEl={anchor}
			open={Boolean(anchor)}
			onClose={handleClose}
			className='item_list___menu_options'
			getContentAnchorEl={null}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
		>
			{!hideEdit && (
				<MenuItem disabled={disable} onClick={handleEdit}>
					{editText || language.data.EDIT}
				</MenuItem>
			)}
			<MenuItem disabled={disable} onClick={handleDelete}>
				{language.data.DELETE}
			</MenuItem>
		</Menu>
	)
}

export default ItemListMenu
