import React from 'react'
import { useLanguage } from '../../../../context/language'

const NoFAQAvailable: React.FC = () => {

	const language = useLanguage()

  return (
    <div className='faq__fail_to_load'>
      <p>{language.data.NO_FAQ_AVAILABLE}</p>
    </div>
  )
}

export default NoFAQAvailable