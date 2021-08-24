import Dexie, { IndexableType } from 'dexie'
import DinoAgentService from '../../agent/DinoAgentService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import SynchronizableDataResponseModel from '../../types/sync/api/response/SynchronizableDataResponseModel'
import SynchronizableDeleteModel from '../../types/sync/api/request/SynchronizableDeleteModel'
import SynchronizableListDataResponseModel from '../../types/sync/api/response/SynchronizableListDataResponseModel'
import SynchronizableSaveAllModel from '../../types/sync/api/request/SynchronizableSaveAllModel'
import SynchronizableDeleteAllListModel from '../../types/sync/api/request/SynchronizableDeleteAllListModel'
import SynchronizableEntity from '../../types/sync/database/SynchronizableEntity'
import SynchronizableLocalState from '../../types/sync/database/SynchronizableLocalState'
import SynchronizableWSUpdateModel from '../../types/sync/api/web_socket/SynchronizableWSUpdateModel'
import SynchronizableWSDeleteModel from '../../types/sync/api/web_socket/SynchronizableWSDeleteModel'
import SyncConstants from '../../constants/sync/SyncConstants'
import SynchronizableGenericDataResponseModel from '../../types/sync/api/response/SynchronizableGenericDataResponseModel'
import ArrayUtils from '../../utils/ArrayUtils'
import SynchronizableDataLocalIdModel from '../../types/sync/api/SynchronizableDataLocalIdModel'
import SynchronizableSyncModel from '../../types/sync/api/request/SynchronizableSyncModel'
import SynchronizableSyncResponseModel from '../../types/sync/api/response/SynchronizableSyncResponseModel'
import DateUtils from '../../utils/DateUtils'
import SynchronizableService from './SynchronizableService'
import WebSocketURLService from '../websocket/path/WebSocketPathService'
import WebSocketSubscriber from '../../types/web_socket/WebSocketSubscriber'
import { hasValue } from '../../utils/Utils'

/**
 * @description Generic service with basic methods (save and delete) that auto synchronize entity with API
 * @param ID API synchronizable entity's id
 * @param DATA_MODEL synchronizable entity's data model
 * @param ENTITY local synchronizable entity
 * @param REPOSITORY local synchronizable entity's repository
 */
export default abstract class AutoSynchronizableService<
	ID extends IndexableType,
	DATA_MODEL extends SynchronizableDataLocalIdModel<ID>,
	ENTITY extends SynchronizableEntity<ID>,
> extends SynchronizableService {
	protected apiBaseURL: string
	protected table: Dexie.Table<ENTITY, number>
	protected webSocketURLService: WebSocketURLService
	protected webSocketBaseURL: string

	constructor(
		table: Dexie.Table<ENTITY, number>,
		requestMapping: string,
		webSocketURLService: WebSocketURLService,
		webSocketBaseURL: string,
	) {
		super()
		this.apiBaseURL = requestMapping
		this.webSocketURLService = webSocketURLService
		this.webSocketBaseURL = webSocketBaseURL
		this.table = table
	}

	//#region METHODS THAT CAN BE OVERWRITTEN

	/**
	 * @description Override this function to do something when a websocket update is received
	 * @param model
	 */
	protected async onWebSocketUpdate(
		model: SynchronizableWSUpdateModel<ID, DATA_MODEL>,
	) {}

	/**
	 * @description Override this function to do something when a websocket delete is received
	 * @param model
	 */
	protected async onWebSocketDelete(model: SynchronizableWSDeleteModel<ID>) {}

	/**
	 * @description Override to add more subscribers to websocket connection
	 */
	onGetWebSocketSubscribers = (): WebSocketSubscriber<any>[] => {
		return []
	}

	protected async beforeDelete(entity: ENTITY) {}

	//#endregion

	//#region CONVERSION MODEL <-> ENTITY

	/**
	 * @description Remember to transform model booleans into number (0,1) to save on database
	 * @param model api data_model
	 */
	abstract convertModelToEntity(model: DATA_MODEL): Promise<ENTITY | undefined>

	/**
	 * @param entity local entity
	 */
	abstract convertEntityToModel(entity: ENTITY): Promise<DATA_MODEL | undefined>

	private async internalConvertModelToEntity(
		model: DATA_MODEL,
	): Promise<ENTITY | undefined> {
		const entity = await this.convertModelToEntity(model)

		if (entity) {
			entity.id = model.id
			entity.lastUpdate = DateUtils.convertDinoAPIStringDateToDate(
				model.lastUpdate!,
			)

			if (hasValue(model.localId)) {
				entity.localId = model.localId
			} else if (hasValue(model.id)) {
				const savedEntity = await this.dbGetById(model.id!)

				if (savedEntity) {
					entity.localId = savedEntity.localId
				}
			}

			return entity
		}
	}

	private async internalConvertEntityToModel(
		entity: ENTITY,
	): Promise<DATA_MODEL | undefined> {
		const model = await this.convertEntityToModel(entity)

		if (model) {
			model.id = entity.id
			model.lastUpdate = DateUtils.convertDateToDinoAPIStringDate(
				entity.lastUpdate!,
			)
			model.localId = entity.localId

			return model
		}
	}

	private internalConvertModelsToEntities = async (
		models: DATA_MODEL[],
	): Promise<ENTITY[]> => {
		const result = await Promise.all(
			models.map(async model => {
				const entity = await this.internalConvertModelToEntity(model)
				if (entity) {
					entity.localState = SynchronizableLocalState.SAVED_ON_API
					return entity
				}
			}),
		)

		return result.filter(model => model !== undefined) as ENTITY[]
	}

	private internalConvertEntitiesToModels = async (
		entities: ENTITY[],
	): Promise<DATA_MODEL[]> => {
		const result = await Promise.all(
			entities.map(entity => this.internalConvertEntityToModel(entity)),
		)

		return result.filter(entity => entity !== undefined) as DATA_MODEL[]
	}

	//#endregion

	//#region PUBLIC REQUESTS

	/**
	 * @description Get a entity by id
	 * @param id Entity's id on API
	 */
	getById = async (id: ID): Promise<ENTITY | undefined> => {
		return this.dbGetById(id)
	}

	/**
	 * @description Get a entity by local id
	 * @param localId Entity's local id
	 */
	getByLocalId = async (localId: number): Promise<ENTITY | undefined> => {
		return this.dbGetByLocalId(localId)
	}

	/**
	 * @description Get all entities
	 */
	getAll = async (): Promise<ENTITY[]> => {
		return this.dbGetAllNotFakeDeletedEntities()
	}

	/**
	 * @description Return the first entity
	 */
	getFirst = async (): Promise<ENTITY | undefined> => {
		const entites = await this.table.toArray()
		return entites.length > 0 ? entites[0] : undefined
	}

	/**
	 * @description Save a entity locally and, if possible, in API
	 * @param entity Entity to save
	 */
	save = async (entity: ENTITY): Promise<ENTITY | undefined> => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()

		if (cantEdit) return undefined

		this.setLastUpdate(entity)
		entity.localState = SynchronizableLocalState.SAVED_LOCALLY

		const dbEntity = await this.dbSave(entity)

		if (dbEntity.localId) {
			this.triggerUpdateEvent()

			const model = await this.internalConvertEntityToModel(entity)

			if (model) {
				const response = await this.apiSave(model)
				if (response && response.success) {
					const newEntity = await this.internalConvertModelToEntity(
						response.data,
					)

					if (newEntity) {
						newEntity.localId = dbEntity.localId
						newEntity.localState = SynchronizableLocalState.SAVED_ON_API
						await this.dbSave(newEntity)
						this.triggerUpdateEvent()

						return newEntity
					} else {
						LogAppErrorService.logMessage(
							JSON.stringify(response.data),
							SyncConstants.CONVERT_MODEL_TO_ENTITY_ERROR,
						)
					}
				}
			}

			return dbEntity
		}
	}

	/**
	 * @description Save entities locally and, if possible, in API
	 * @param entities Entities to save
	 */
	saveAll = async (entities: ENTITY[]) => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()
		if (cantEdit) return

		entities.forEach(entity => {
			this.setLastUpdate(entity)
			entity.localState = SynchronizableLocalState.SAVED_LOCALLY
		})

		await this.dbSaveAll(entities)

		const models = await this.internalConvertEntitiesToModels(entities)

		const response = await this.apiSaveAll(models)

		if (response && response.success) {
			const models = response.data
			const newEntities = await this.internalConvertModelsToEntities(models)
			await this.dbSaveAll(newEntities)
		} else {
			await this.dbSaveAll(entities)
		}

		this.triggerUpdateEvent()
	}

	/**
	 * @description Save new entity from API data model
	 * @param model Data model of entity
	 */
	saveFromDataModelLocally = async (model: DATA_MODEL) => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()

		if (cantEdit) return

		const entity = await this.internalConvertModelToEntity(model)
		if (entity) {
			await this.saveOnlyLocally(entity)
		}
	}

	/**
	 * @description Save new entities from API data model locally
	 * @param models Data models of each entity
	 */
	saveAllFromDataModelLocally = async (models: DATA_MODEL[]) => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()

		if (cantEdit) return

		const entities = await this.internalConvertModelsToEntities(models)
		if (entities.length > 0) {
			await this.saveAllOnlyLocally(entities)
		}
	}

	/**
	 * @description Save an entity only locally (without sync)
	 * @param entity Entity to save
	 */
	saveOnlyLocally = async (entity: ENTITY) => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()

		if (cantEdit) return

		await this.dbSave(entity)
		this.triggerUpdateEvent()
	}

	/**
	 * @description Save entities only locally (without sync)
	 * @param entities Entities to save
	 */
	saveAllOnlyLocally = async (entities: ENTITY[]) => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()

		if (cantEdit) return

		await this.dbSaveAll(entities)
		this.triggerUpdateEvent()
	}

	/**
	 * @description Delete a entity locally and, if possible, in API
	 * @param entity Entity to delete
	 */
	delete = async (entity: ENTITY): Promise<void> => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()

		if (cantEdit) return

		await this.beforeDelete(entity)

		if (entity.id === undefined) return this.deleteLocalItem(entity)

		this.setLastUpdate(entity)

		const deleted = await this.dbFakeDelete(entity)
		const errorDeletingLocally = !deleted
		if (errorDeletingLocally) return

		this.triggerUpdateEvent()

		const model = await this.internalConvertEntityToModel(entity)
		const errorGeneratingModel = model === undefined
		if (errorGeneratingModel) {
			this.logErrorGeneratingModel(entity)
			return
		}

		const response = await this.apiDelete(model!!)
		const errorOnRequest = response === undefined
		if (errorOnRequest) return

		if (response!.success) {
			await this.dbDelete(entity)
		} else if (response!.data) {
			await this.saveUpdatedItem(response!, entity)
		}
	}

	private saveUpdatedItem = async (
		response: SynchronizableDataResponseModel<ID, DATA_MODEL>,
		entity: ENTITY,
	) => {
		const apiEntity = await this.internalConvertModelToEntity(response.data)
		if (apiEntity) {
			apiEntity.localId = entity.localId
			apiEntity.localState = SynchronizableLocalState.SAVED_ON_API
			await this.dbSave(apiEntity)
			this.triggerUpdateEvent()
		} else {
			LogAppErrorService.logMessage(
				JSON.stringify(response.data),
				SyncConstants.CONVERT_MODEL_TO_ENTITY_ERROR,
			)
		}
	}

	private logErrorGeneratingModel = (entity: ENTITY): void => {
		LogAppErrorService.logMessage(
			JSON.stringify(entity),
			SyncConstants.CONVERT_ENTITY_TO_MODEL_ERROR,
		)
	}

	private deleteLocalItem = async (entity: ENTITY): Promise<void> => {
		await this.dbDelete(entity)
		this.triggerUpdateEvent()
	}

	/**
	 * @description Delete entities locally and, if possible, in API
	 * @param entities Entities to delete
	 */
	deleteAll = async (entities: ENTITY[]) => {
		const cantEdit = await this.hasNotNecessaryPermissionToEdit()

		if (cantEdit) return

		await Promise.all(entities.map(entity => this.beforeDelete(entity)))

		const filterById = ArrayUtils.partition(entities, entity =>
			hasValue(entity.id),
		)

		await this.dbDeleteAll(filterById.notSelected)

		if (filterById.selected.length > 0) {
			const deleted = await this.dbFakeDeleteAll(filterById.selected)
			this.triggerUpdateEvent()
			if (deleted) {
				const models = await this.internalConvertEntitiesToModels(entities)
				const deleteAllResponse = await this.apiDeleteAll(models)

				if (deleteAllResponse && deleteAllResponse.success) {
					await this.dbDeleteAll(entities)
					this.triggerUpdateEvent()
				}
			}
		}
	}

	/**
	 * @description Erase all data on local database
	 */
	clearDatabase = async () => {
		await this.dbClear()
	}

	//#endregion

	//#region AUTH

	/**
	 * @description Apply service rules, clears local data, when user logout
	 */
	onLogout = async (): Promise<void> => {
		return this.dbClear()
	}

	//#endregion

	//#region WEB SOCKET

	/**
	 * @description Return basic WebSocket subscribers for auto synchronizable service.
	 * To add more dependencies use onGet... function.
	 */
	protected getWebSocketSubscribers = (): WebSocketSubscriber<any>[] => {
		const defaultSubscribers = [
			{
				path: this.getUpdateWebSocketPath(),
				callback: this.webSocketUpdate,
			},
			{
				path: this.getDeleteWebSocketPath(),
				callback: this.webSockeDelete,
			},
		]

		const extraSubscribers = this.onGetWebSocketSubscribers()

		return defaultSubscribers.concat(extraSubscribers)
	}

	private getUpdateWebSocketPath = (): string => {
		const partialUpdateURL =
			this.webSocketBaseURL + SyncConstants.WEBSOCKET_UPDATE_URL

		return this.addWebSocketBaseURL(partialUpdateURL)
	}

	private getDeleteWebSocketPath = (): string => {
		const partialDeleteURL =
			this.webSocketBaseURL + SyncConstants.WEBSOCKET_DELETE_URL

		return this.addWebSocketBaseURL(partialDeleteURL)
	}

	private addWebSocketBaseURL = (url: string): string => {
		return this.webSocketURLService.generateDestinationPath(url)
	}

	private webSocketUpdate = async (
		model: SynchronizableWSUpdateModel<ID, DATA_MODEL>,
	) => {
		if (model && model.data && model.data.length > 0) {
			const entities = await this.internalConvertModelsToEntities(model.data)
			entities.forEach(entity => (entity.localId = undefined))

			const orderedEntities = entities
				.filter(entity => hasValue(entity.id))
				.sort(this.sortEntityById)

			const dbEntities = await this.dbGetAllById(orderedEntities)

			const orderedDbEntities = dbEntities.sort(this.sortEntityById)

			let count = 0

			const entitiesToSave = orderedEntities.map(entity => {
				const dbEntity = orderedDbEntities[count]

				if (dbEntity && entity.id === dbEntity.id) {
					entity.localId = dbEntity.localId
					count++
				}

				return entity
			})

			await this.dbSaveAll(entitiesToSave)

			await this.onWebSocketUpdate(model)

			this.triggerUpdateEvent()
		}
	}

	private webSockeDelete = async (model: SynchronizableWSDeleteModel<ID>) => {
		if (model && model.data && model.data.length > 0) {
			await this.dbDeleteAllById(model.data)
			await this.onWebSocketDelete(model)
			this.triggerUpdateEvent()
		}
	}

	//#endregion

	//#region SYNC

	/**
	 * @description Start entity sync with API.
	 * Based in user permissions, sync process can edit or only read data from server
	 */
	protected sync = async (): Promise<boolean> => {
		const canEdit = await this.hasNecessaryPermissionToEdit()
		if (canEdit) {
			return this.syncWithEdit()
		}
		const canRead = await this.hasNecessaryPermissionToRead()
		if (canRead) {
			return this.syncWithoutEdit()
		}

		return true
	}

	private getNotSavedModels = async (): Promise<DATA_MODEL[]> => {
		const notSavedEntities = await this.dbGetAllNotSavedOnAPI()

		return this.internalConvertEntitiesToModels(notSavedEntities)
	}

	private syncWithEdit = async (): Promise<boolean> => {
		const notSavedModels = await this.getNotSavedModels()

		const response = await this.apiSaveSync(notSavedModels)

		if (response && response.success) {
			const entities = await this.internalConvertModelsToEntities(response.data)

			await this.dbClearAndSaveAll(entities)

			this.triggerUpdateEvent()

			return true
		}

		return false
	}

	private syncWithoutEdit = async (): Promise<boolean> => {
		const response = await this.apiGetAll()
		if (response && response.success) {
			const entities = await this.internalConvertModelsToEntities(response.data)
			await this.dbClearAndSaveAll(entities)
			this.triggerUpdateEvent()
			return true
		}
		return false
	}

	/**
	 * @description Start entity delete sync with API.
	 */
	protected syncDelete = async (): Promise<boolean> => {
		const deletedEntities = await this.dbGetAllFakeDeletedEntities()
		const hasNotEntitiesToDelete = deletedEntities.length === 0

		if (hasNotEntitiesToDelete) return true

		const models = await this.internalConvertEntitiesToModels(deletedEntities)

		const response = await this.apiDeleteAll(models)

		if (response && response.success) {
			await this.dbClearFakeDeletedEntities()

			this.triggerUpdateEvent()

			return true
		}

		return false
	}

	//#endregion

	//#region DATABASE

	/**
	 * @description Filter database query removing invalid data and returning a list.
	 */
	protected toList = (collection: Dexie.Collection<ENTITY, number>) => {
		return this.filterValidData(collection).toArray()
	}

	/**
	 * @description Filter database query removing invalid data and returning first item.
	 */
	protected toFirst = (collection: Dexie.Collection<ENTITY, number>) => {
		return this.filterValidData(collection).first()
	}

	private filterValidData = (collection: Dexie.Collection<ENTITY, number>) => {
		return collection.filter(
			item => item.localState !== SynchronizableLocalState.DELETED_LOCALLY,
		)
	}

	private dbGetById = async (id: ID) => {
		return this.table.where('id').equals(id).first()
	}

	private dbGetByLocalId = async (localId: number) => {
		return this.table.where('localId').equals(localId).first()
	}

	private dbGetAllById = async (entities: ENTITY[]): Promise<ENTITY[]> => {
		const ids = entities
			.filter(entity => hasValue(entity.id))
			.map(entity => entity.id!)
		return this.table.where('id').anyOf(ids).toArray()
	}

	private dbDelete = async (entity: ENTITY) => {
		if (entity.localId) {
			await this.dbDeleteByLocalId(entity.localId)
		}
	}

	private dbDeleteByLocalId = async (localId: number) => {
		await this.table.delete(localId)
	}

	private dbFakeDelete = async (entity: ENTITY): Promise<boolean> => {
		if (entity.localId) {
			const deletedItens = await this.table
				.where('localId')
				.equals(entity.localId)
				.modify(item => {
					item.localState = SynchronizableLocalState.DELETED_LOCALLY
					item.lastUpdate = entity.lastUpdate
				})
			return deletedItens === 1
		}
		return false
	}

	private dbFakeDeleteAll = async (entities: ENTITY[]): Promise<boolean> => {
		const deletedItens = await this.dbFakeDeleteAllWithId(entities)

		return deletedItens > 0
	}

	private dbFakeDeleteAllWithId = async (entities: ENTITY[]) => {
		const lastUpdate = this.getLastUpdate()

		const entitiesIds = entities
			.filter(entity => hasValue(entity.localId))
			.map(entity => entity.localId!)

		return await this.table
			.where('localId')
			.anyOf(entitiesIds)
			.modify(item => {
				item.localState = SynchronizableLocalState.DELETED_LOCALLY
				item.lastUpdate = lastUpdate
			})
	}

	private dbDeleteAll = async (entities: ENTITY[]) => {
		const localIds = entities
			.filter(entity => hasValue(hasValue(entity.localId)))
			.map(entity => entity.localId!)

		return this.table.where('localId').anyOf(localIds).delete()
	}

	private dbDeleteAllById = async (ids: ID[]) => {
		await this.table.where('id').anyOf(ids).delete()
	}

	private dbSave = async (entity: ENTITY): Promise<ENTITY> => {
		this.removeEmptyLocalIdFromEntity(entity)

		const localId = await this.table.put(entity)

		entity.localId = localId

		return entity
	}

	private dbGetAllNotFakeDeletedEntities = async (): Promise<ENTITY[]> => {
		return this.table
			.where('localState')
			.notEqual(SynchronizableLocalState.DELETED_LOCALLY)
			.toArray()
	}

	private dbGetAllFakeDeletedEntities = async (): Promise<ENTITY[]> => {
		return this.table
			.where('localState')
			.equals(SynchronizableLocalState.DELETED_LOCALLY)
			.toArray()
	}

	private dbGetAllNotSavedOnAPI = async (): Promise<ENTITY[]> => {
		return this.table
			.where('localState')
			.equals(SynchronizableLocalState.SAVED_LOCALLY)
			.toArray()
	}

	private dbSaveAll = async (entities: ENTITY[]) => {
		this.removeEmptyLocalIdFromEntities(entities)
		const ids = await this.table.bulkPut(entities, { allKeys: true })
		entities.forEach((entity, index) => (entity.localId = ids[index]))
	}

	private dbClearFakeDeletedEntities = async () => {
		await this.table
			.where('localState')
			.equals(SynchronizableLocalState.DELETED_LOCALLY)
			.delete()
	}

	private dbClear = async () => {
		await this.table.clear()
	}

	private dbClearAndSaveAll = async (entities: ENTITY[]) => {
		await this.dbClear()
		await this.dbSaveAll(entities)
	}

	//#endregion

	//#region API

	private getBaseRequestURL = (): string => {
		return this.apiBaseURL
	}

	private getRequestURL = (): string => `${this.getBaseRequestURL()}get/`

	private saveRequestURL = (): string => `${this.getBaseRequestURL()}save/`

	private deleteRequestURL = (): string => `${this.getBaseRequestURL()}delete/`

	private getAllRequestURL = (): string => `${this.getRequestURL()}all/`

	private saveAllRequestURL = (): string => `${this.saveRequestURL()}all/`

	private deleteAllRequestURL = (): string => `${this.deleteRequestURL()}all/`

	private syncRequestURL = (): string => `${this.getBaseRequestURL()}sync/`

	private apiSave = async (
		data: DATA_MODEL,
	): Promise<SynchronizableDataResponseModel<ID, DATA_MODEL> | undefined> => {
		const request = await DinoAgentService.post(this.saveRequestURL())

		if (request.canGo) {
			try {
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(data).go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return undefined
	}

	private apiDelete = async (
		model: DATA_MODEL,
	): Promise<SynchronizableDataResponseModel<ID, DATA_MODEL> | undefined> => {
		const request = await DinoAgentService.delete(this.deleteRequestURL())

		if (request.canGo) {
			const requestModel: SynchronizableDeleteModel<ID> = {
				id: model.id,
				lastUpdate: model.lastUpdate,
			}

			try {
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(requestModel).go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return undefined
	}

	private apiSaveAll = async (
		models: DATA_MODEL[],
	): Promise<
		SynchronizableListDataResponseModel<ID, DATA_MODEL> | undefined
	> => {
		const request = await DinoAgentService.post(this.saveAllRequestURL())

		if (request.canGo) {
			const requestModel: SynchronizableSaveAllModel<ID, DATA_MODEL> = {
				data: models,
			}

			try {
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(requestModel).go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return undefined
	}

	private apiGetAll = async (): Promise<
		SynchronizableListDataResponseModel<ID, DATA_MODEL> | undefined
	> => {
		const request = await DinoAgentService.get(this.getAllRequestURL())

		if (request.canGo) {
			try {
				const authRequest = await request.authenticate()
				const response = await authRequest.go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return undefined
	}

	private apiDeleteAll = async (
		models: DATA_MODEL[],
	): Promise<SynchronizableGenericDataResponseModel<Array<ID>> | undefined> => {
		const request = await DinoAgentService.delete(this.deleteAllRequestURL())

		if (request.canGo) {
			const requestModel: SynchronizableDeleteAllListModel<ID> = {
				data: models.map(model => ({
					id: model.id,
					lastUpdate: model.lastUpdate,
				})),
			}

			try {
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(requestModel).go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return undefined
	}

	private apiSaveSync = async (
		toSave: Array<DATA_MODEL>,
	): Promise<SynchronizableSyncResponseModel<ID, DATA_MODEL> | undefined> => {
		try {
			const request = await DinoAgentService.put(this.syncRequestURL())

			if (request.canGo) {
				const requestModel: SynchronizableSyncModel<ID, DATA_MODEL> = {
					save: toSave,
				}

				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(requestModel).go()
				return response.body
			}
		} catch (e) {
			LogAppErrorService.logError(e)
		}

		return undefined
	}

	//#endregion

	//#region UTILS

	private getLastUpdate = () => {
		return new Date()
	}

	private setLastUpdate = (entity: ENTITY) => {
		entity.lastUpdate = this.getLastUpdate()
	}

	private sortEntityById = (a: ENTITY, b: ENTITY): number => {
		if (a.id! > b.id!) {
			return 1
		} else {
			return -1
		}
	}

	private removeEmptyLocalIdFromEntities(entities: Array<ENTITY>) {
		entities.forEach(entity => this.removeEmptyLocalIdFromEntity(entity))
	}

	private removeEmptyLocalIdFromEntity(entity: ENTITY) {
		if (entity.localId === undefined || entity.localId === null) {
			delete entity.localId
		}
	}

	//#endregion
}
