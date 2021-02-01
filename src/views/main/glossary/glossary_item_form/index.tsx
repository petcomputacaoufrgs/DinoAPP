import { TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { useLanguage } from '../../../../context/language'
import GlossaryService from '../../../../services/glossary/GlossaryService'
import GlossaryItemEntity from '../../../../types/glossary/database/GlossaryItemEntity'
import './styles.css'

interface GlossaryItemFormProps {
  open: boolean,
  item?: GlossaryItemEntity
  handleClose: () => void
}

const getItem = (item: GlossaryItemEntity | undefined) => {
  return item || getEmptyItem()
}

const getEmptyItem = () => {
  return { title: '', subtitle: '', text: '', fullText: ''} as GlossaryItemEntity
}

const GlossaryItemForm: React.FC<GlossaryItemFormProps> = ( props ) => {

  const language = useLanguage()
  const [item, setItem] = useState<GlossaryItemEntity>(getItem(props.item))

  useEffect(() => {
    if(props.open) {
      setItem(getItem(props.item))
    }
  }, [props.open])

  const handleSave = () => {
    GlossaryService.save(item)
    props.handleClose()
    setItem({ title: '', subtitle: '', text: '', fullText: ''})
	}

  return (
      <DinoDialog
				open={props.open}
				handleSave={handleSave}
				handleClose={props.handleClose}
			>
				<div className='glossary_item__form_content'>
          <TextField
            required
            fullWidth
            value={item.title}
            onChange={(e) => setItem({...item, title: e.target.value})}
            margin='dense'
            label={`${language.data.TITLE}`}
            type='name'
            inputProps={{ maxLength: 100 }}//Constants.NAME_MAX }}
            //error={isNameInvalid(props.contact.name)}
          />
          <br />
          <TextField
            fullWidth
            value={item.subtitle}
            onChange={(e) => setItem({...item, subtitle: e.target.value})}
            margin='dense'
            label={`${language.data.SUBTITLE}`}
            type='text'
            inputProps={{ maxLength: 100 }}
            //error={props.contact.description?.length === Constants.DESCRIPTION_MAX}
          />
          <br />
          <TextField
            multiline
            rows={3}
            fullWidth
            value={item.text}
            onChange={(e) => setItem({...item, text: e.target.value})}
            margin='dense'
            label={`${language.data.TEXT}`}
            type='text'
            inputProps={{ maxLength: 100 }}
            //error={props.contact.description?.length === Constants.DESCRIPTION_MAX}
          />
          <br />
          <TextField
            multiline
            rows={5}
            fullWidth
            value={item.fullText}
            onChange={(e) => setItem({...item, fullText: e.target.value})}
            margin='dense'
            label={`${language.data.FULL_TEXT}`}
            type='text'
            inputProps={{ maxLength: 1000 }}
            //error={props.contact.description?.length === Constants.DESCRIPTION_MAX}
          />
          <br />
        </div>
			</DinoDialog>
  )
}

export default GlossaryItemForm