import SynchronizableDataLocalIdModel from "../../sync/api/SynchronizableDataLocalIdModel"

export interface KidsSpaceSettingsModel extends SynchronizableDataLocalIdModel<number> {
    firstSettingsDone: boolean
    color: string
    hat: string
}