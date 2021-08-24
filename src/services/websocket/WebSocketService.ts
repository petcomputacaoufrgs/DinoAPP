import SockJS from 'sockjs-client'
import Stomp, { Message } from 'stompjs'
import APIHeaderConstants from '../../constants/api/APIHeaderConstants'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import WebSocketConstants from '../../constants/api/WebSocketConstants'
import WebSocketCallback from '../../types/web_socket/WebSocketCallback'
import WebSocketSubscriber from '../../types/web_socket/WebSocketSubscriber'
import AuthService from '../auth/AuthService'
import ConnectionService from '../connection/ConnectionService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import SyncService from '../sync/SyncService'

class WebSocketService {
	private socket?: WebSocket
	private stompClient?: Stomp.Client
	private subscribers: WebSocketSubscriber<any>[]
	private tryReconnectTimeout: NodeJS.Timeout | undefined

	constructor() {
		this.subscribers = []
	}

	connect = async (): Promise<boolean> => {
		const isAuthenticated = await AuthService.isAuthenticated()

		if (isAuthenticated) {
			try {
				const response = await AuthService.requestWebSocketAuthToken()
				if (response && response.success) {
					const responseData = response.data
					const baseUrl = this.getSocketBaseURL(responseData.webSocketToken)
					this.socket = new SockJS(baseUrl)
					this.stompClient = Stomp.over(this.socket)
					this.muteConnectionLogs()
					this.stompClient.connect({}, this.subscribe)
					this.socket.onclose = () => {
						this.handleWebSocketClosed()
					}
					this.socket.onerror = () => {
						this.handleWebSocketError()
					}
					return true
				}
			} catch (e) {
				this.tryReconnect()
				LogAppErrorService.logModel(e)
			}
		}
		return false
	}

	disconnect = () => {
		if (this.stompClient && this.stompClient.connected) {
			this.stompClient.disconnect(() => {}, {})
		}
	}

	addSubscriber = <DATA_TYPE>(subscriber: WebSocketSubscriber<DATA_TYPE>) => {
		this.subscribers.push(subscriber)

		if (this.stompClient && this.stompClient.connected) {
			this.disconnect()
			this.connect()
		}
	}

	private handleWebSocketClosed = () => {
		SyncService.setNotSynced()
		if (this.stompClient && !this.stompClient.connected) {
			this.tryReconnect()
		}
	}

	private handleWebSocketError = () => {
		LogAppErrorService.logModel({
			date: new Date(),
			error: WebSocketConstants.ERROR_MESSAGE,
			title: WebSocketConstants.ERROR_TITLE,
			file: '',
		})

		SyncService.setNotSynced()
		if (this.stompClient && !this.stompClient.connected) {
			this.tryReconnect()
		}
	}

	private tryReconnect = () => {
		if (this.tryReconnectTimeout !== undefined) {
			if (ConnectionService.isConnected()) {
				this.tryReconnectTimeout = setTimeout(async () => {
					const success = await this.connect()
					this.tryReconnectTimeout = undefined
					if (success) {
						SyncService.sync()
					} else {
						this.tryReconnect()
					}
				}, WebSocketConstants.DELAY_TO_RECONNECT_IN_MIN * 60000)
			}
		}
	}

	private muteConnectionLogs = () => {
		if (this.stompClient) {
			this.stompClient.debug = (...args: string[]) => {}
		}
	}

	private subscribe = () => {
		this.subscribers.forEach(subscriber => {
			this.stompClient?.subscribe(subscriber.path, (message: Message) => {
				this.filterCallback(subscriber.callback, message)
			})
		})
	}

	private filterCallback<DATA_TYPE>(
		callback: WebSocketCallback<DATA_TYPE>,
		message: Message,
	) {
		if (message.body) {
			callback(JSON.parse(message.body))
		} else {
			callback(undefined)
		}
	}

	private getSocketBaseURL(token: string): string {
		return `${APIWebSocketPathsConstants.ROOT}?${APIHeaderConstants.WS_AUTHORIZATION}=${token}`
	}
}

export default new WebSocketService()
