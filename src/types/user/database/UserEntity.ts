import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface UserEntity
  extends SynchronizableEntity<number> {
  name: string
  email: string
  pictureURL: string
  pictureBase64?: string
  permission: string
}
