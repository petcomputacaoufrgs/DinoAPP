import React, { useEffect, useState } from 'react'
import ArrowBack from '../../../../components/arrow_back'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'
import DinoSwitch from '../../../../components/switch'
import PathConstants from '../../../../constants/app/PathConstants'
import { useLanguage } from '../../../../context/language'
import HistoryService from '../../../../services/history/HistoryService'
import SliderBoard from './components/board'
import './styles.css'

export const useEvent = (event: any, handler: {(this: Window, ev: any): any; (this: Window, ev: any): any;}, passive = false) => {
  useEffect(() => {
      window.addEventListener(event, handler, passive)
      return () => window.removeEventListener(event, handler)
  })
}

const DinoSlider: React.FC = () => {

  const language = useLanguage()

  const [openDialog, setOpenDialog] = useState(false)
  const [restart, setRestart] = useState(false)
  const [reduced, setReduced] = useState(false)

  const handleClose = () => {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	const handleRestart = () => {
    setOpenDialog(false)
    setRestart(true)
	}

	const handleGameOver = () => {
    setRestart(false)
    setOpenDialog(true)
  }

  return (
    <div className="minigame dino_slider">
      <GameOverDialog
        onAgree={handleRestart}
        onDisagree={handleClose}
        open={openDialog}
      >
        <p>{language.data.SUCESS_GAME_OVER_LABEL}</p>
      </GameOverDialog>
      <div className="dino_slider__header">
        <ArrowBack kids />
        <div className='dino_slider__switch'>
          <DinoSwitch 
           selected={reduced} 
            onChangeSelected={() => setReduced(!reduced)} 
            label={language.data.REDUCE}
          />
        </div>
      </div>
      <SliderBoard 
        onGameOver={handleGameOver} 
        restart={restart}
        reduced={reduced}
      />
    </div>
  )}

export default DinoSlider