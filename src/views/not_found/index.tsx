import React, { useContext } from 'react'
import { LanguageProviderContext } from '../../components/language_provider'
import PageNotFound from '../../images/page-not-found.svg'
import HistoryService from '../../services/HistoryService'
import PathConstants from '../../constants/PathConstants'
import './styles.css'

const redirectTimeout = 3000

/**
 * @description Tela para diretório não encontrado
 */
const NotFound = (): JSX.Element => {

    const languageContext = useContext(LanguageProviderContext)

    const redirectToHome = () => {
        HistoryService.push(PathConstants.HOME)
    }

    setTimeout(redirectToHome, redirectTimeout)

    return (
        <div className='not_found'>
            <p className='not_found__text'>{languageContext.NOT_FOUND_MESSAGE} &nbsp; :(</p>
            <p className='not_found__text'>{languageContext.NOT_FROND_REDIRECT_MESSAGE}</p>
            <img className='not_found__image' src={PageNotFound} alt='Página não encontrada'/>
        </div>
    )
}

export default NotFound