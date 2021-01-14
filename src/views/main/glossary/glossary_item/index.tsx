import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Divider } from '@material-ui/core'
import { useLanguage } from '../../../../context/language'
import GlossaryItemEntity from '../../../../types/glossary/database/GlossaryItemEntity'
import GlossaryService from '../../../../services/glossary/GlossaryService'
import Loader from '../../../../components/loader'
import './styles.css'

interface RouterParams {
  localId: string
}

const GlossaryItem: React.FC = () => {
  const { localId } = useParams<RouterParams>()

  const language = useLanguage()

  const [isLoading, setIsLoadind] = useState(true)
  const [glossaryItem, setGlossaryItem] = useState<GlossaryItemEntity | undefined>(undefined)

  useEffect(() => {
    let loadData = async () => {
      const item = await GlossaryService.getByLocalId(Number(localId))

      if (item) {
        updateData(item)
      }

      finishLoading()
    }

    let updateData = (item: GlossaryItemEntity) => {
      setGlossaryItem(item)
    }

    let finishLoading = () => {
      setIsLoadind(false)
    }

    GlossaryService.addUpdateEventListenner(loadData)

    if (isLoading) {
      loadData()
    }

    return () => {
      updateData = () => {}
      finishLoading = () => {}
      GlossaryService.removeUpdateEventListenner(loadData)
    }
  }, [isLoading, localId])

  return (
    <Loader className='glossary_item_loader' isLoading={isLoading} hideChildren>
      <div className="glossary_item">
          <div className="card__header">
            <div className="card__header__title">
              {glossaryItem ? glossaryItem.title : language.data.NO_AVAILABLE_TEXT}
            </div>
            <div className="card__typography muted">
              {glossaryItem ? glossaryItem.subtitle : ''}
            </div>
          </div>
          <Divider />
          <div className="card__content">
            <div className="card__typography">
              {glossaryItem?.fullText || language.data.NO_AVAILABLE_TEXT}
            </div>
          </div>
      </div>
    </Loader>
  )
}

export default GlossaryItem
