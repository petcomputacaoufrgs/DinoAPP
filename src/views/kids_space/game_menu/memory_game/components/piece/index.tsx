import React from 'react'
import './styles.css'
import PieceProps from './props'

const MemoryPiece: React.FC<PieceProps> = ({
    piece,
    onClick,
    turnedBack,
    visible
}) => {
    const Image = piece.image        

    const getClassName = () => (
        piece.turned? 
            turnedBack ? "piece_container reverse" 
                : visible? "piece_container turned" 
                    : "piece_container scored" 
            : "piece_container"
    )

    const renderPiece = () => (
        <div className={getClassName()}>
            <div className="piece piece__back" />
            <Image className="piece piece__front" />
        </div>
    )

    return (
        <div className="piece" onClick={onClick}>
        { piece.visible
            ? renderPiece()
            : <div className="piece__invisible_piece" />
        }
        </div>
    )
}

export default MemoryPiece