import React, { useState, useEffect } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import useStyles from '../styles'
import ContactFormDialog from '../contact_dialog_form'
import ContactsService from '../../../../services/contact/ContactsService'

const ContactItems = (props: ContactItemsProps): JSX.Element => {

  const classes = useStyles()

  const [open, setOpen] = useState(0)
  const [edit, setEdit] = useState(-1)
  const [_delete, setDelete] = useState(0)
    
  useEffect(() => {
    if (_delete) 
        props.setItems([...ContactsService.deleteContact(_delete)])
  }, [_delete])

  useEffect(()=> {
    if (!edit) 
      props.setItems([...ContactsService.getItems()])
  }, [edit])


  return (
    <List className={classes.list}>
        {props.items.map((contact) => (
          <div key={contact.id}>
              <ContactItemList
                item={contact}
                setEdit={setEdit}
                setDelete={setDelete}
                onClick={() => setOpen(contact.id)}
              >
                <ContactCard
                  item={contact}
                  onClose={() => setOpen(0)}
                  setEdit={setEdit}
                  setDelete={setDelete}
                  dialogOpen={open === contact.id}
                  setDialogOpen={setOpen}
                />
                <ContactFormDialog
                  item={contact}
                  dialogOpen={edit === contact.id}
                  setDialogOpen={setEdit}
                  action="edit"
                />
              </ContactItemList>
          </div>
        ))}
    </List>
  )
}

export default ContactItems
