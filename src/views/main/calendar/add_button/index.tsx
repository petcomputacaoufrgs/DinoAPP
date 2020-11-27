import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditEventModal from '../edit_event_modal'
import './styles.css'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'

const AddButton: React.FC = () => {
  const language = useCurrentLanguage()

  const [openDialog, setOpenDialog] = useState(false)

  const handleAddClick = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <div className="calendar__add_button">
      <Fab
        color="primary"
        aria-label={language.ADD_ARIA_LABEL}
        onClick={handleAddClick}
      >
        <AddIcon />
      </Fab>
      <EditEventModal open={openDialog} onClose={handleCloseDialog} />
    </div>
  )
}

export default AddButton
