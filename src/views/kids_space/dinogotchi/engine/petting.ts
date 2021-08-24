import sleep from '../../../../utils/SleepUtils'

let isRunningAnimation = false

export function startPettingEngine() {
    const dino = document.getElementById('dino_pet')
    isRunningAnimation = false

    if (dino) {
        dino.onclick = () => {
            handleDinoClick()
        }
    }
}

async function handleDinoClick() {
    if (isRunningAnimation) return
    isRunningAnimation = true

    const hearts = document.getElementById('dinogotchi_screen__hearts')
    if (hearts) {
        hearts.classList.add('petting')
        await sleep(300)
        hearts.classList.remove('petting')
    }

    isRunningAnimation = false
}