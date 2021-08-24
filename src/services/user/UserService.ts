import UserDataModel from '../../types/user/api/UserModel'
import ImageToBase64Utils from '../../utils/ImageToBase64Utils'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import UserEntity from '../../types/user/database/UserEntity'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import GooglePhotoResponseModel from '../../types/google_api/people/GooglePhotosResponseModel'
import GoogleUserService from './GoogleUserService'
import GooglePeopleAPIUtils from '../../utils/GooglePeopleAPIUtils'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import { hasValue } from '../../utils/Utils'
import DinoAgentService from '../../agent/DinoAgentService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import { toggle } from '../../constants/toggle/Toggle'

class UserServiceImpl extends AutoSynchronizableService<
	number,
	UserDataModel,
	UserEntity
> {
	constructor() {
		super(
			Database.user,
			APIHTTPPathsConstants.USER,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.USER,
		)
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

	getPicture(user: UserEntity | undefined): string | undefined {
		return user !== undefined
			? user.pictureBase64
				? user.pictureBase64
				: user.pictureURL
			: undefined
	}

	getName(user: UserEntity | undefined) {
		return user !== undefined ? user.name : ''
	}

	async updateUser(model: UserDataModel) {
		await this.clearDatabase()
		await this.saveFromDataModelLocally(model)
	}

	async convertModelToEntity(
		model: UserDataModel,
	): Promise<UserEntity | undefined> {
		const entity: UserEntity = {
			email: model.email,
			name: model.name,
			pictureURL: model.pictureURL,
			permission: model.permission,
		}

		return entity
	}

	async convertEntityToModel(
		entity: UserEntity,
	): Promise<UserDataModel | undefined> {
		const model: UserDataModel = {
			email: entity.email,
			name: entity.name,
			pictureURL: entity.pictureURL,
			permission: entity.permission,
		}

		return model
	}

	async getPermission(): Promise<string | undefined> {
		if (toggle.overridePermission.override)
			return toggle.overridePermission.permission

		const user = await this.getFirst()
		if (user) {
			return toggle.overridePermission.override
				? toggle.overridePermission.permission
				: user.permission
		}
		return undefined
	}

	protected async onSaveEntity(entity: UserEntity) {
		await this.clearDatabase()
		if (hasValue(entity.id)) {
			const savedEntity = await this.getByLocalId(entity.id!)

			if (savedEntity) {
				const withoutSavedPicture = savedEntity.pictureBase64 === undefined
				const pictureUrlChanged = entity.pictureURL !== savedEntity.pictureURL

				if (withoutSavedPicture || pictureUrlChanged) {
					this.downloadPicture(entity.pictureURL, entity.id!)
				}
			} else {
				this.downloadPicture(entity.pictureURL, entity.id!)
			}
		}
	}

	protected async onSyncSuccess() {
		const user = await this.getFirst()

		if (user) {
			this.verifyGoogleUserPhoto(user)
		}
	}

	async verifyGoogleUserPhoto(entity: UserEntity) {
		if (hasValue(entity.id)) {
			const photoModel = await GoogleUserService.getUserGoogleAPIPhoto()

			if (photoModel) {
				const primaryPhoto = this.getPrimaryPhotoFromGooglePhotos(photoModel)

				if (primaryPhoto && primaryPhoto.url) {
					const newPictureURL = GooglePeopleAPIUtils.changeImageSize(
						primaryPhoto.url,
						125,
					)

					if (entity.pictureURL !== newPictureURL) {
						entity.pictureURL = newPictureURL
						await this.save(entity)
						this.downloadPicture(newPictureURL, entity.id!)
					}
				}
			}
		}
	}

	public deleteAccount = async (): Promise<boolean> => {
		const request = await DinoAgentService.delete(
			APIHTTPPathsConstants.DELETE_ACCOUNT,
		)

		if (request.canGo) {
			try {
				const authRequest = await request.authenticate()
				const response = await authRequest.go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return false
	}

	private downloadPicture = (pictureURL: string, localId: number) => {
		try {
			ImageToBase64Utils.getBase64FromImageSource(
				pictureURL,
				'jpeg',
				this.saveDowloadedImage,
				localId,
			)
		} catch (e) {
			LogAppErrorService.logError(e)
		}
	}

	private saveDowloadedImage = async (
		base64Image: string,
		success: boolean,
		id?: any,
	) => {
		if (success && hasValue(id)) {
			const savedEntity = await this.getById(id)
			if (savedEntity) {
				savedEntity.pictureBase64 = base64Image
				await this.saveOnlyLocally(savedEntity)
			}
		}
	}

	private getPrimaryPhotoFromGooglePhotos = (
		model: GooglePhotoResponseModel,
	) => {
		return model.photos.find(photo => photo.metadata.primary)
	}
}

export default new UserServiceImpl()
