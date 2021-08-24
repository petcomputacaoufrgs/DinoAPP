import React from 'react'
import { useLanguage } from '../../../../context/language'
import AddIcon from '@material-ui/icons/Add';
import './styles.css'
import DinoIconButton from '..'

interface AddButtonProps {
  handleAdd: () => void,
  label?: string
}

const AddButton: React.FC<AddButtonProps> = ({ handleAdd, label }) => {

  const language = useLanguage()
  
  return (
    <DinoIconButton
      ariaLabel={`${language.data.ADD} ${label}`}
      className='add_button'
      icon={AddIcon}
      onClick={handleAdd}
      circular
    />
  )
}

export default AddButton
