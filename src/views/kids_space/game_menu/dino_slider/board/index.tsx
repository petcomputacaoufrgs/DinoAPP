import React, { useEffect, useState } from 'react'
import { useEvent } from '..'
import DinoSwitch from '../../../../../components/switch'
import { toggle } from '../../../../../constants/toggle/Toggle'
import { useLanguage } from '../../../../../context/language'
import ArrayUtils from '../../../../../utils/ArrayUtils'
import SliderPiece from '../piece'
import SliderBoardProps, { HandleSwipeProps } from './props'
import './styles.css'

const SliderBoard: React.FC<SliderBoardProps> = ({restart, onGameOver, reduced}) => {
    
  const PIECES = 16
  const LINES = PIECES / 4 
  const TO = 0
  const FROM = 1

  const language = useLanguage()
  const [gameState, setGameState] = useState([] as number[])

  const addNumber = (grid: number[]) => {
    let freeIndexes = new Array<number>()

    grid.forEach((p, index) => {
      if(p === 0) freeIndexes.push(index) 
    })
    
    if(ArrayUtils.isNotEmpty(freeIndexes)) {
      let randomIndex = ArrayUtils.randomItem(freeIndexes)
      grid[randomIndex] = Math.random() >= 0.4 ? 2 : 4
    } else checkGameOver()
  }

  const checkGameOver = () => {
    const hasMoveLeft = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]
    .some(move => handleKeyDown(move, true))

    if(!hasMoveLeft) onGameOver()
  }

  const handleKeyDown = (key: string, checkPossibleMove?: boolean) => {

    const moveProps: HandleSwipeProps | undefined = moveFunctions[key]

    return moveProps ? handleSwipe(moveProps, checkPossibleMove) : false
  }

  const initialize = () => {

    const getPow2Grid = () => {
      const arr = new Array<number>()
      for (let i = 1; i <= PIECES; i++) {
        arr.push(i <= 12 ? Math.pow(2, i) : 0)
      }
      return arr
    }

    let newGrid = toggle.testAll2048Pieces ? getPow2Grid() : new Array<number>(PIECES).fill(0)
    addNumber(newGrid)
    addNumber(newGrid)
    return newGrid
  }

  useEffect(() => setGameState(initialize()), [restart])
  
  useEvent("keydown", (event: KeyboardEvent) => handleKeyDown(event.key))

  const handleSwipe = ({isOffline, selectLinePieces, nextPieceFrom}: HandleSwipeProps, onlyCheckPossibleMove?: boolean) => {

    const transfer = (array: number[], pieceTo: number, pieceFrom: number) => {
      array[pieceTo] += array[pieceFrom]
      array[pieceFrom] = 0
    }

    let newArray = [...gameState]
    let pieces = [0,1]
    
    for(let i = 0; i < LINES; i++) {
      selectLinePieces(pieces, i)
      while (!isOffline(pieces[TO], i)) {
        if(isOffline(pieces[FROM], i)) {
          selectLinePieces(pieces)
        }
        else if(newArray[pieces[FROM]] === 0) {
          nextPieceFrom(pieces)
        } 
        else if(newArray[pieces[TO]] === 0 || newArray[pieces[TO]] === newArray[pieces[FROM]]) {
          if(onlyCheckPossibleMove) return true
          transfer(newArray, pieces[TO], pieces[FROM])
          nextPieceFrom(pieces)
        } 
        else selectLinePieces(pieces)
      }
    }

    if(!onlyCheckPossibleMove) {
      addNumber(newArray)
      setGameState([...newArray])
    }
    
    return false
  }

  const handleSwipeLeft: HandleSwipeProps = {
    isOffline: (piece, iterator) => piece > (iterator * LINES) + LINES - 1,    
    selectLinePieces: (pieces, iterator) => {
      pieces[TO] = iterator !== undefined ? (iterator * LINES) : (pieces[TO] + 1)
      pieces[FROM] = pieces[TO] + 1
    },
    nextPieceFrom: (pieces) => pieces[FROM]++
}

  const handleSwipeUp: HandleSwipeProps = {
    isOffline: (piece, iterator) => piece > iterator + (LINES * (LINES - 1)),
    selectLinePieces: (pieces, iterator) => {
      pieces[TO] = iterator !== undefined ? iterator : (pieces[TO] + LINES)
      pieces[FROM] = pieces[TO] + LINES
    },
    nextPieceFrom: (pieces) => pieces[FROM] += LINES    
  }

  const handleSwipeDown: HandleSwipeProps = {
    isOffline: (piece, iterator) => piece < iterator,
    selectLinePieces: (pieces, iterator) => {
      pieces[TO] = iterator !== undefined ? (iterator + LINES * (LINES - 1)) : (pieces[TO] - LINES)
      pieces[FROM] = pieces[TO] - LINES
    },
    nextPieceFrom: (pieces) => pieces[FROM] -= LINES
  }

  const handleSwipeRight: HandleSwipeProps = {
    isOffline: (piece, iterator) => piece < (iterator * LINES),
    selectLinePieces: (pieces, iterator) => {
      pieces[TO] = iterator !== undefined ? (iterator * LINES + (LINES - 1)) : (pieces[TO] - 1)
      pieces[FROM] = pieces[TO] - 1
    },
    nextPieceFrom: (pieces) => pieces[FROM]--
  }

  const moveFunctions = {
    ArrowUp: handleSwipeUp,
    ArrowDown: handleSwipeDown,
    ArrowLeft: handleSwipeLeft,
    ArrowRight: handleSwipeRight,
  }

  return (
    <>
      <div className="board">
          {gameState.map((number, index) => 
            <SliderPiece reduced={reduced} num={number} key={index}/>
          )}
      </div>
    </>
  )
}

export default SliderBoard