import Database from '../../storage/Database'
import PostMessageType from '../../types/service_worker/PostMessageType'
import TabEntity from '../../types/tab_control/TabEntity'
import { hasValue } from '../../utils/Utils'
import EventService from '../events/EventService'
import PostMessageService from '../service_worker/PostMessageService'
import UpdatableService from '../update/UpdatableService'

class TabControlService extends UpdatableService {
	private table: Dexie.Table<TabEntity, number>
	private tabId?: number

	constructor() {
		super()
		this.table = Database.tab
	}

	start = () => {
		window.addEventListener('unload', () => {
			PostMessageService.sendPostMessage({
				type: PostMessageType.TAB_CLOSED,
				info: this.tabId,
			})
		})
	}

	registerTab = async () => {
		if (process.env.NODE_ENV !== 'production') return

		const tab: TabEntity = {
			isMain: 1,
		}
		await this.save(tab)

		PostMessageService.sendPostMessage({
			type: PostMessageType.REGISTER_NEW_TAB,
			info: this.tabId,
		})
	}

	onMessageReceived = async () => {
		await EventService.whenTabLoad()
		this.triggerUpdateEvent()
	}

	onProofOfLifeRequisition = async (tabId: number) => {
		if (this.tabId === tabId) return

		const tab: TabEntity = {
			isMain: 0,
		}

		await this.save(tab)
		this.triggerUpdateEvent()
	}

	changeToMainTab = () => {
		PostMessageService.sendPostMessage({
			type: PostMessageType.SET_MAIN_TAB,
			info: this.tabId,
		})
	}

	isMainTab = async (): Promise<boolean> => {
		if (process.env.NODE_ENV !== 'production') return true

		if (hasValue(this.tabId)) {
			const tab = await this.getById(this.tabId!)
			if (tab) {
				return tab.isMain === 1
			}
		}
		return false
	}

	private getById = async (id: number): Promise<TabEntity | undefined> => {
		return this.table.where('id').equals(id).first()
	}

	private save = async (entity: TabEntity): Promise<TabEntity> => {
		const id = await this.table.put(entity)

		entity.id = id

		this.tabId = id

		return entity
	}
}

export default new TabControlService()
