import React, { useEffect, useState } from 'react'
import BoardProps from './props'
import MemoryPiece from '../piece'
import './styles.css'

const BASE_ANIMATION_DELAY = 500

function sleep(ms:number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

const MemoryBoard: React.FC<BoardProps> = ({
    pieceList,
    onGameOver,
    restart
}) => {
    const [pieceState, setPieceState] = useState(pieceList)
    const [turnedPieceIndex, setTurnedPieceIndex] = useState<number>(-1)
    const [blocked, setBlocked] = useState<boolean>(false)
    const [score, setScore] = useState(0)
    const [turnBack, setTurnBack] = useState<boolean>(false)
    const [visibility, setVisibility] = useState(true)

    useEffect(() => {
        if(restart) {
            setScore(0)
            setPieceState(pieceList)
            setTurnedPieceIndex(-1)
            setBlocked(false)
            setTurnBack(false)
            setVisibility(true)
        }
    }, [restart, pieceList])

    useEffect(() => {
        if (!blocked && score === pieceList.length/2) {
            onGameOver()
            setBlocked(true)
        }
    }, [blocked, score, onGameOver, pieceList.length])

    const handleOnClick = async(index: number) => {
        if(!pieceState[index].turned && !blocked) {
            pieceState[index].turned = true

            if(turnedPieceIndex === -1) {
                setTurnedPieceIndex(index)
            } else {
                setPieceState([...pieceState])
                setBlocked(true)
                
                await sleep(BASE_ANIMATION_DELAY)

                if (pieceState[turnedPieceIndex].image === pieceState[index].image) {
                    setScore(score + 1)
                    
                    setVisibility(false)

                    await sleep(BASE_ANIMATION_DELAY)

                    setBlocked(false)
                    setVisibility(true)

                    pieceState[turnedPieceIndex].visible = false
                    pieceState[index].visible = false
                } else {
                    setTurnBack(true)

                    await sleep(BASE_ANIMATION_DELAY)

                    setTurnBack(false)
                    setBlocked(false)
                   
                    // desvirar as peças
                    pieceState[index].turned = false
                    pieceState[turnedPieceIndex].turned = false
                }

                setTurnedPieceIndex(-1)
            }

            setPieceState([...pieceState])
        }
    }

    return (
        <div className="Board">
            {pieceState.map((piece, index) => 
                <MemoryPiece 
                    key={index} 
                    piece={piece} 
                    turnedBack={turnBack} 
                    visible={visibility} 
                    onClick={() => handleOnClick(index)} 
                />
            )}
        </div>
    )
}

export default MemoryBoard