import React from 'react'
import useStyles from '../../styles'
import { useLanguage } from '../../../../../provider/app_provider'
import ContactItemListProps from './props'
import { Avatar, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, IconButton, Menu, MenuItem } from '@material-ui/core'
import ContactsService from '../../../../../services/contact/ContactsService'
import { MoreVert } from '@material-ui/icons'

const ContactItemList = (props: ContactItemListProps): JSX.Element => {

    const classes = useStyles(props)
    const language = useLanguage().current

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpen = () => props.onClick(props.item.id)

    const handleClose = () => setAnchorEl(null)

    const handleEdit = () => {
        props.setEdit(props.item.id)
        handleClose()
    }
    const handleDelete = () => {
        props.setDelete(props.item.id)
        handleClose()
    }

    return (
        <>
            <ListItem button onClick={handleOpen}>
                <ListItemAvatar>
                    <Avatar aria-label="recipe" className={classes[props.item.color]}>
                        {props.item.name[0].toUpperCase()}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.item.name} secondary={ContactsService.getPhoneTypes(props.item.phones)}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="options" onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleEdit}>{language.EDIT_OPTION_TEXT}</MenuItem>
                <MenuItem onClick={handleDelete}>{language.DELETE_OPTION_TEXT}</MenuItem>
            </Menu>
            {props.children}
        </>
    )
}

export default ContactItemList
