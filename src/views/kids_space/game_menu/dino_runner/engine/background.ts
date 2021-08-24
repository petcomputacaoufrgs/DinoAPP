import SkyAnimation from '../../../animation/SkyAnimation'

const STAR_SPEED = 3000

/**
 * @description set all stars to be animated and start the animation
 * @return funtion to stop the animation
 */
export function startBackgroundEngine() {
	const stars = [
		document.getElementById('dino_runner__star_one'),
		document.getElementById('dino_runner__star_two'),
		document.getElementById('dino_runner__star_three'),
		document.getElementById('dino_runner__star_four'),
		document.getElementById('dino_runner__star_five'),
		document.getElementById('dino_runner__star_six'),
		document.getElementById('dino_runner__star_seven'),
		document.getElementById('dino_runner__star_eight'),
		document.getElementById('dino_runner__star_nine'),
		document.getElementById('dino_runner__star_ten'),
		document.getElementById('dino_runner__star_eleven'),
	].filter(el => el !== null) as HTMLElement[]

	const skyAnimation = new SkyAnimation()
	skyAnimation.startSkyEngine(stars, STAR_SPEED, true)

	return skyAnimation.stopSkyEngine
}
