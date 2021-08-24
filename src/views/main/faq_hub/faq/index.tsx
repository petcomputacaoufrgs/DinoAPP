import React, { useState } from 'react'
import DinoSearchBar from '../../../../components/search_bar'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import FaqView from '../../../../types/faq/view/FaqView'
import FaqItems from '../faq_list_items'

const Faq: React.FC<{ view?: FaqView }> = ({ view }) => {
	const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <DinoSearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value as string)}
      />
      { view && <FaqItems data={TreatmentService.getFaqViewByFilter(view, searchTerm)} />}
    </>
  )
}

export default Faq