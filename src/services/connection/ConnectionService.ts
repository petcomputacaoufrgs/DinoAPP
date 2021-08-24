import Superagent from 'superagent'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import sleep from '../../utils/SleepUtils'
import ArrayUtils from '../../utils/ArrayUtils'
import HttpStatus from '../../types/http/HttpStatus'

type ConnectionListennerCallback = (online: boolean) => void

const DELAY_TO_VERIFY_DINO_CONNECTION = 2000

class ConnectionService {
	private callbacks: ConnectionListennerCallback[]
	private tryingToConnect: boolean
	private connected: boolean

	constructor() {
		this.callbacks = []
		this.tryingToConnect = false
		this.connected = false
		this.start()
	}

	addEventListener = (callback: ConnectionListennerCallback) => {
		if (!this.callbacks.includes(callback)) {
			this.callbacks.push(callback)
		}
	}

	removeEventListener = (callback: ConnectionListennerCallback) => {
		this.callbacks = ArrayUtils.remove(this.callbacks, callback)
	}

	isConnected = (): boolean => {
		return this.connected
	}

	isDisconnected = (): boolean => {
		return !this.connected
	}

	isDinoConnected = async (): Promise<Boolean> => {
		const isConnected = await this.internalIsDinoConnected()

		if (!isConnected) {
			this.verify()
		}

		return isConnected
	}

	verify = async () => {
		if (navigator.onLine) {
			await this.awaitForDinoConnection()
		} else {
			this.setDisconnected()
		}
	}

	private internalIsDinoConnected = async (): Promise<Boolean> => {
		try {
			const request = Superagent.get(APIHTTPPathsConstants.TEST_CONNECTION)

			const response = await request

			return response.status === HttpStatus.OK
		} catch (e) {
			return false
		}
	}

	private start = () => {
		if (navigator.onLine) {
			this.setConnected()
			this.awaitForDinoConnection()
		} else {
			this.setDisconnected()
		}

		window.addEventListener('online', () => {
			this.awaitForDinoConnection()
		})

		window.addEventListener('offline', () => {
			this.setDisconnected()
		})
	}

	private awaitForDinoConnection = async () => {
		if (!this.tryingToConnect) {
			this.tryingToConnect = true
			while (navigator.onLine) {
				const isDinoConnected = await this.isDinoConnected()
				if (isDinoConnected) {
					this.setConnected()
					this.tryingToConnect = false
					break
				} else {
					this.setDisconnected()
				}

				await sleep(DELAY_TO_VERIFY_DINO_CONNECTION)
			}
		}
	}

	private setConnected = () => {
		if (this.isDisconnected()) {
			this.connected = true

			this.callbacks.forEach(callback => callback(true))
		}
	}

	private setDisconnected = () => {
		if (this.isConnected()) {
			this.connected = false

			this.callbacks.forEach(callback => callback(false))
		}
	}
}

export default new ConnectionService()
