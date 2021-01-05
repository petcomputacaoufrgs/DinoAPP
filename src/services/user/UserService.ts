import UserDataModel from '../../types/user/api/UserModel'
import ImageToBase64Utils from '../../utils/ImageToBase64Utils'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import UserEntity from '../../types/user/database/UserEntity'
import UserRepository, {
  UserRepositoryImpl,
} from '../../storage/database/user/UserRepository'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import GooglePhotoResponseModel from '../../types/google_api/people/GooglePhotosResponseModel'
import GoogleUserService from './GoogleUserService'
import GooglePeopleAPIUtils from '../../utils/GooglePeopleAPIUtils'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueueURLService from '../websocket/WebSocketQueueURLService'

export class UserServiceImpl extends AutoSynchronizableService<
  number,
  UserDataModel,
  UserEntity,
  UserRepositoryImpl
> {
  constructor() {
    super(
      UserRepository,
      APIRequestMappingConstants.USER,
      WebSocketQueueURLService,
      APIWebSocketDestConstants.USER
    )
  }

  getDependencies(): SynchronizableService[] {
    return []
  }

  getPicture(entities: UserEntity[]): string {
    return entities.length > 0
      ? entities[0].pictureBase64
        ? entities[0].pictureBase64
        : entities[0].pictureURL
      : ''
  }

  getName(entities: UserEntity[]) {
    return entities.length > 0 ? entities[0].name : ''
  }

  async updateUser(model: UserDataModel) {
    await this.localClearAndSaveAllFromModels([model])
  }

  async convertModelToEntity(
    model: UserDataModel
  ): Promise<UserEntity | undefined> {
    const entity: UserEntity = {
      email: model.email,
      name: model.name,
      pictureURL: model.pictureURL,
    }

    return entity
  }

  async convertEntityToModel(
    entity: UserEntity
  ): Promise<UserDataModel | undefined> {
    const model: UserDataModel = {
      email: entity.email,
      name: entity.name,
      pictureURL: entity.pictureURL,
    }

    return model
  }

  protected async onSaveEntity(entity: UserEntity) {
    await this.repository.clear()
    if (entity.id !== undefined) {
      const savedEntity = await this.repository.getByLocalId(entity.id)

      if (savedEntity) {
        const withoutSavedPicture = savedEntity.pictureBase64 === undefined
        const pictureUrlChanged = entity.pictureURL !== savedEntity.pictureURL

        if (withoutSavedPicture || pictureUrlChanged) {
          this.donwloadPicture(entity.pictureURL, entity.id)
        }
      } else {
        this.donwloadPicture(entity.pictureURL, entity.id)
      }
    }
  }

  protected async onSyncSuccess() {
    const user = await this.repository.getFirst()

    if (user) {
      this.verifyGoogleUserPhoto(user)
    }
  }

  async verifyGoogleUserPhoto(entity: UserEntity) {
    if (entity.id !== undefined) {
      const photoModel = await GoogleUserService.getUserGoogleAPIPhoto()

      if (photoModel) {
        const primaryPhoto = this.getPrimaryPhotoFromGooglePhotos(photoModel)

        if (primaryPhoto && primaryPhoto.url) {
          const newPictureURL = GooglePeopleAPIUtils.changeImageSize(
            primaryPhoto.url,
            125
          )

          if (entity.pictureURL !== newPictureURL) {
            entity.pictureURL = newPictureURL
            await this.save(entity)
            this.donwloadPicture(newPictureURL, entity.id)
          }
        }
      }
    }
  }

  private donwloadPicture = (pictureURL: string, localId: number) => {
    try {
      ImageToBase64Utils.getBase64FromImageSource(
        pictureURL,
        'jpeg',
        this.saveDowloadedImage,
        localId
      )
    } catch (e) {
      LogAppErrorService.logError(e)
    }
  }

  private saveDowloadedImage = async (
    base64Image: string,
    success: boolean,
    id?: any
  ) => {
    if (success && id !== undefined) {
      const savedEntity = await this.repository.getById(id)
      if (savedEntity) {
        savedEntity.pictureBase64 = base64Image
        await this.localSave(savedEntity)
      }
      this.updateContext()
    }
  }

  private getPrimaryPhotoFromGooglePhotos = (
    model: GooglePhotoResponseModel
  ) => {
    return model.photos.find((photo) => photo.metadata.primary)
  }
}

export default new UserServiceImpl()
