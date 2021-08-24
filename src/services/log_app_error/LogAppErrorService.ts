import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import DinoAgentService from '../../agent/DinoAgentService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import LogAppErrorListModel from '../../types/log_app_error/api/LogAppErrorListModel'
import LogAppErrorEntity from '../../types/log_app_error/database/LogAppErrorEntity'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketSubscriber from '../../types/web_socket/WebSocketSubscriber'
import Database from '../../storage/Database'
import PermissionEnum from '../../types/enum/PermissionEnum'

class LogAppErrorService extends SynchronizableService {
	private table: Dexie.Table<LogAppErrorEntity, number>

	constructor() {
		super()
		this.table = Database.logAppError
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return []
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	protected getWebSocketSubscribers(): WebSocketSubscriber<any>[] {
		return []
	}

	protected async sync(): Promise<boolean> {
		const logs = await this.getSavedLogs()
		if (logs.length > 0) {
			const items: LogAppErrorModel[] = logs.map(log => ({
				title: log.title,
				error: log.error,
				file: log.file,
				date: log.date,
			}))

			const model: LogAppErrorListModel = {
				items: items,
			}

			return this.saveAll(model)
		}

		return true
	}

	protected async syncDelete(): Promise<boolean> {
		return true
	}

	getSavedLogs = (): Promise<LogAppErrorEntity[]> => {
		return this.table.toArray()
	}

	logError = (error: Error) => {
		if (error) {
			this.logModel({
				date: new Date(),
				error: error.stack ? error.stack : 'Empty stack',
				title: error.message,
			} as LogAppErrorModel)
		}
	}

	logModel = async (model: LogAppErrorModel) => {
		if (model.error) {
			if (!model.date) {
				model.date = new Date()
			}

			const request = await DinoAgentService.post(
				APIHTTPPathsConstants.SAVE_LOG_APP_ERROR,
			)

			if (request.canGo) {
				try {
					const authRequest = await request.authenticate()

					await authRequest.setBody(model).go()
				} catch {
					this.saveLocalLog(model)
				}
			} else {
				this.saveLocalLog(model)
			}
		}
	}

	logSyncAPIError = (error: string) => {
		if (error) {
			this.logModel({
				date: new Date(),
				error: error,
				title: 'API error',
			} as LogAppErrorModel)
		}
	}

	logMessage = (message: string, title: string) => {
		if (message) {
			this.logModel({
				date: new Date(),
				error: message,
				title: title,
			} as LogAppErrorModel)
		}
	}

	saveAll = async (models: LogAppErrorListModel): Promise<boolean> => {
		const request = await DinoAgentService.post(
			APIHTTPPathsConstants.SAVE_ALL_LOG_APP_ERROR,
		)

		if (request.canGo) {
			try {
				const authRequest = await request.authenticate()
				await authRequest.setBody(models).go()
				await this.dbDeleteAll()
				return true
			} catch {}
		}

		return false
	}

	onLogout = async () => {
		await this.dbDeleteAll()
	}

	private dbDeleteAll = async () => {
		await this.table.clear()
	}

	private dbSave = async (log: LogAppErrorEntity) => {
		const id = await this.table.put(log)

		log.id = id
	}

	private saveLocalLog = (model: LogAppErrorModel) => {
		const log: LogAppErrorEntity = {
			date: model.date,
			error: model.error,
			file: model.file,
			title: model.title,
		}
		this.dbSave(log)
	}
}

export default new LogAppErrorService()
