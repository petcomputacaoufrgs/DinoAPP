import SynchronizableEntity from "../../sync/database/SynchronizableEntity"

export interface KidsSpaceSettingsEntity extends SynchronizableEntity<number> {
    firstSettingsDone: boolean
    color: string
    hat: string 
}