import sleep from '../../../../../utils/SleepUtils'
import { getRandomInteger } from '../../../../../utils/RandomUtils'
import { startBackgroundEngine } from './background'

const INITIAL_OBSTACLE_POSITION = 850
const MIN_DISTANCE = 250
const OUT_OF_SCREEN_POSITION = -300

//#region Variables
// Elements to keep track of
let dino: HTMLElement | null
let grid: HTMLElement | null
let container: HTMLElement | null
let scoreBoard: HTMLElement | null

// General variables
let score = 0
let dinoYPosition = 0

// Control states
let isJumping = false
let isGameOver = false

// Functions to handle events
let onGameEnd: () => void
let handleStopBackgroundEngine: () => void
//#endregion

/**
 * @description set all HTML elements and events
 * @param handleGameEnd div where the game renders
 * @param dinoContainer div where the game renders
 * @param dinoGrid div containg the game grid 
 * @param character div containg the character
 * @param dinoScoreBoard div containing the score display
 * @return list with the functions to handle the start of game and to handle the stop of animation
 */
export function startDinoRunnerGame(
	handleGameEnd: () => void,
	dinoContainer: HTMLDivElement,
	dinoGrid: HTMLDivElement,
	character: HTMLDivElement,
	dinoScoreBoard: HTMLDivElement,
) {
	setHTMLElements(character, dinoGrid, dinoContainer, dinoScoreBoard)
	addExitGameListener()
	onGameEnd = handleGameEnd
	setScore(0)

	return [handleStopBackgroundEngine, handleStartGame]
}

/**
 * @description set all divs to their respective variables
 */
const setHTMLElements = (character, dinoGrid, dinoContainer, dinoScoreBoard) => {
	dino = character
	grid = dinoGrid
	container = dinoContainer
	scoreBoard = dinoScoreBoard
}

/**
 * @description add event to reset all variables when the user exit the game before it's finish
 */
const addExitGameListener = () => {
	const goBackButton = document.getElementsByClassName('dino_icon_button')[0]
	goBackButton.addEventListener('click', () => {
		isJumping = false
		score = 0
		dinoYPosition = 0
		dino = null
		grid = null
		container = null
		scoreBoard = null
	})
}

/**
 * @description set variables to start the game, start animations and generate obstacles
 */
function handleStartGame() {
	isJumping = false
	isGameOver = false
	score = 0
	dinoYPosition = 0
	setScore(0)

	handleStopBackgroundEngine = startBackgroundEngine()
	if (dino && grid && container) {
		container.onpointerdown = jumpingControl
		runGame()
	}
}

/**
 * @description verify if the character is jumping or not
 */
async function jumpingControl() {
	if (dino && !isGameOver && !isJumping) {
		isJumping = true
		await jump(dino)
		isJumping = false
	}
}

/**
 * @description make the jump animation
 * @param dino div containing the character
 */
async function jump(dino: HTMLElement) {
	let gravity = 1
	let y_velocity = 17
	dinoYPosition = 0

	do {
		// projectile motion
		dinoYPosition += y_velocity
		y_velocity -= gravity
		dino.style.transform = `translate3d(0, -${dinoYPosition}%, 0)`
		await sleep(20)
	} while (dinoYPosition > 0)

	dino.style.transform = `translate3d(0, 0, 0)`
}

/**
 * @description generate a new obstacle in the screen and control the score
 */
async function runGame() {
	const obstacle = createObstacle()
	let increaseSpeed = 0
	let obstaclePosition = INITIAL_OBSTACLE_POSITION
	let nextObstacleGenerated = false


	if (grid) {
		grid.appendChild(obstacle)

		while (obstaclePosition >= OUT_OF_SCREEN_POSITION) {
			if (!nextObstacleGenerated && obstaclePosition < MIN_DISTANCE * -1) {
				nextObstacleGenerated = true
				generateNextObstacle()
			}

			if (isGameOver) break

			const hasCollision = obstaclePosition > -160 && obstaclePosition < -50 && dinoYPosition < 50
			if (hasCollision) {
				isGameOver = true
				handleStopBackgroundEngine()
				onGameEnd()
				break
			}

			await sleep(20)
			if (increaseSpeed < 7.5) increaseSpeed = score * 0.1 // Limite de velocidade
			obstaclePosition -= 10 + increaseSpeed // Jogo fica mais rápido de acordo com a quantidade de pontos
			obstacle.style.transform = `translate3d(${obstaclePosition}%, 0, 0)`
		}

		score++
		setScore(score)
		obstacle.remove()
	}
}

/**
 * @description set an interval to call the next obstacle
 * @return obstacle div created 
 */
const createObstacle = () => {
	const obstacle = document.createElement('div')
	obstacle.classList.add('dino_runner_game__obstacle')
	obstacle.style.transform = `translate3d(${INITIAL_OBSTACLE_POSITION}%, 0, 0)`
	return obstacle
}

/**
 * @description set an interval to call the next obstacle
 */
async function generateNextObstacle() {
	if (!isGameOver) {
		const randomTime = getRandomInteger(0, 800)
		await sleep(randomTime)
		runGame()
	}
}

/**
 * @description display the current score on screen
 */
function setScore(score: number) {
	if (scoreBoard) {
		scoreBoard.innerHTML = `<p>${score}</p>`
	}
}