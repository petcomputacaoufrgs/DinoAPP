import React from 'react'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'
import { Avatar, CardHeader, IconButton } from '@material-ui/core'
import { ColorLens as ColorLensIcon } from '@material-ui/icons'
import ContactFormDialogHeaderProps from './props'
import Constants from '../../../../../constants/contact/ContactsConstants'
import CloseComponent from '../../../../../components/icon_buttons/close_component'
import '../../styles.css'

const AddContactDialogHeader = (
  props: ContactFormDialogHeaderProps
): JSX.Element => {

  const language = useCurrentLanguage()

  return (
    <CardHeader
      avatar={
        <Avatar
          aria-label={language.AVATAR_ALT}
          className={`avatar__color-${props.color}`}
        >
          {props.name ? props.name[0].toUpperCase() : '?'}
        </Avatar>
      }
      action={
        <>
          <IconButton
            aria-label={language.CHANGE_COLOR_ARIA_LABEL}
            size="small"
            className={"icon-button"}
            onClick={props.handleChangeColor}
          >
            <ColorLensIcon />
          </IconButton>
          <CloseComponent onClose={props.handleCloseDialog} />
        </>
      }
      title={
        props.action === Constants.ACTION_ADD
          ? props.name || language.CONTACTS_ADD_CONTACT
          : props.name
      }
      subheader="Contato"
    />
  )
}

export default AddContactDialogHeader
