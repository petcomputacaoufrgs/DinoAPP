const TOTAL_TURNS = 20

//#region Variables
// States and control variables
let allPlaysOrder: number[] = []
let playerOrder: number[] = []
let currentDinoDisplaying: number
let currentTurn: number
let gameCanContinue: boolean
let compTurn: boolean
let gameWon: boolean
let gameBlocked: boolean

// Interval control variable
let intervalId: NodeJS.Timeout | null

// Elements variables
let dinoMusicalButtons: (HTMLElement | null)[]
let startButton: HTMLElement | null
let turnDiv: HTMLElement | null

// Functions variables
let onWin: () => void
// //#endregion

//#region Functions
/**
 * @description initialize game variables
 * @param handleWin callback for win game event
 */
export const startGame = (handleWin: () => void) => {
	onWin = handleWin
	setHTMLElements()
	addOnClickHandler()

	gameWon = true
	compTurn = false
	gameBlocked = false

	if (gameWon) {
		startButton!.style.display = 'none'
		beginGame()
	}
}

/**
 * @description set all divs to their respective variables
 */
const setHTMLElements = () => {
	dinoMusicalButtons = [
		document.getElementById('musical_dino__topleft'),
		document.getElementById('musical_dino__topright'),
		document.getElementById('musical_dino__bottomleft'),
		document.getElementById('musical_dino__bottomright')
	]
	startButton = document.getElementById('musical_dino__start')
	turnDiv = document.getElementById('musical_dino__header__turn')
}

/**
 * @description add on click events to each button
 */
const addOnClickHandler = () => {
	dinoMusicalButtons.forEach((musicalButton, index) => {
		musicalButton!.onclick = () => {
			if (!compTurn && !gameBlocked) {
				playerOrder.push(index + 1)
				gameBlocked = true
				checkGameStatus()
				animateDino(index)
				if (!gameWon) {
					setTimeout(() => {
						clearColor()
						gameBlocked = false
					}, 300)
				}
			}
		}
	})
}

/**
 * @description set initial variables and initialize turns
 */
const beginGame = () => {
	setInitialValuesToVariables()
	displayScore()
}

/**
 * @description set initial values to necessary variables
 */
const setInitialValuesToVariables = () => {
	gameWon = false
	playerOrder = []
	currentDinoDisplaying = 0
	currentTurn = 1
	gameCanContinue = true
	compTurn = true
	allPlaysOrder = fillArrayRandomly()
	intervalId = setInterval(gameTurn, 800)
}

/**
 * @description fill array with numbers between 1 and 4 
 */
const fillArrayRandomly = () => {
	const newArray: number[] = []
	for (let i = 0; i < TOTAL_TURNS; i++) {
		newArray.push(Math.floor(Math.random() * 4) + 1)
	}
	return newArray
}

/**
 * @description display current score in game
 */
const displayScore = () => {
	if (turnDiv) {
		turnDiv.innerHTML = currentTurn.toString()
	}
}

/**
 * @description display computer's turn
 */
const gameTurn = () => {
	if (currentDinoDisplaying === currentTurn) {
		clearInterval(intervalId!)
		compTurn = false
		clearColor()
	}

	if (compTurn) {
		clearColor()
		setTimeout(() => {
			let dinoToAnimate = allPlaysOrder[currentDinoDisplaying]
			animateDino(dinoToAnimate - 1)
			currentDinoDisplaying++
		}, 200)
	}
}

/**
 * @description animate the correct dino
 * @param index index of witch dino button need to be animated
 */
const animateDino = (index: number) => {
	const audio = document.getElementById(`musical_dino__clip${index + 1}`) as HTMLAudioElement | null
	if (audio) {
		audio.play()
	}
	dinoMusicalButtons[index]!.classList.add('musical_dino__dino_moving')
}

/**
 * @description clear all dino animations
 */
const clearColor = () => {
	dinoMusicalButtons.forEach(dinoButton => {
		dinoButton!.classList.remove('musical_dino__dino_moving')
	})
}

/**
 * @description animate all dinos
 */
const flashColor = () => {
	dinoMusicalButtons.forEach(dinoButton => {
		dinoButton!.classList.add('musical_dino__dino_moving')
	})
}

/**
 * @description verify current game status
 */
const checkGameStatus = () => {
	if (playerOrder[playerOrder.length - 1] !== allPlaysOrder[playerOrder.length - 1]) {
		gameCanContinue = false
	}

	if (playerOrder.length === TOTAL_TURNS && gameCanContinue) {
		winGame()
		return
	}

	if (!gameCanContinue) {
		handlePlayerWrongPlay()
		return
	}

	if (currentTurn === playerOrder.length && gameCanContinue && !gameWon) {
		handlePlayerCorrectPlay()
		return
	}
}

/**
 * @description set variables to user's correct play 
 */
const handlePlayerCorrectPlay = () => {
	currentTurn++
	displayScore()
	playerOrder = []
	currentDinoDisplaying = 0
	compTurn = true
	intervalId = setInterval(gameTurn, 800)
}

/**
 * @description set variables to user's wrong play
 */
const handlePlayerWrongPlay = () => {
	flashColor()
	currentDinoDisplaying = 0
	playerOrder = []
	gameCanContinue = true
	compTurn = true
	setTimeout(() => {
		clearColor()
		intervalId = setInterval(gameTurn, 800)
	}, 800)
}

/**
 * @description win game
 */
const winGame = () => {
	flashColor()
	gameWon = true
	onWin()
}
//#endregion
