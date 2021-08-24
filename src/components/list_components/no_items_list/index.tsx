import { useLanguage } from '../../../context/language'
import './styles.css' 

const NoItemsList = () => {

  const language = useLanguage()

  return (
    <div className='no_items'>
      <h5>{language.data.NO_ITEMS_LIST}</h5>
    </div>
  )
}

export default NoItemsList