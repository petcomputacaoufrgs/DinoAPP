import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import EssentialContactDataModel from '../../types/contact/api/EssentialContactDataModel'
import EssentialContactEntity from '../../types/contact/database/EssentialContactEntity'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import TreatmentService from '../treatment/TreatmentService'

import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import { hasValue } from '../../utils/Utils'
import EssentialPhoneService from './EssentialPhoneService'

const TRUE = 1
const FALSE = 0

type removeTreatmentAcumType = {
	toSave: EssentialContactEntity[]
	toDelete: EssentialContactEntity[]
}

class EssentialContactServiceImpl extends AutoSynchronizableService<
	number,
	EssentialContactDataModel,
	EssentialContactEntity
> {
	constructor() {
		super(
			Database.essentialContact,
			APIHTTPPathsConstants.ESSENTIAL_CONTACT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.ESSENTIAL_CONTACT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.ADMIN, PermissionEnum.STAFF]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	protected async beforeDelete(entity: EssentialContactEntity) {
		if (entity.localId) {
			const essentialPhones =
				await EssentialPhoneService.getAllByEssentialContactLocalId(
					entity.localId,
				)
			await EssentialPhoneService.deleteAll(essentialPhones)
		}
	}

	async convertModelToEntity(
		model: EssentialContactDataModel,
	): Promise<EssentialContactEntity> {
		const entity: EssentialContactEntity = {
			name: model.name,
			description: model.description,
			color: model.color,
			isUniversal: TRUE,
		}

		if (model.treatmentIds) {
			const treatments = await TreatmentService.getAllByIds(model.treatmentIds)
			const treatmentLocalIds = treatments
				.filter(treatment => hasValue(treatment.localId))
				.map(treatment => treatment.localId!)

			if (ArrayUtils.isNotEmpty(treatmentLocalIds)) {
				entity.isUniversal = FALSE
				entity.treatmentLocalIds = treatmentLocalIds
			}
		}

		return entity
	}

	async convertEntityToModel(
		entity: EssentialContactEntity,
	): Promise<EssentialContactDataModel> {
		const model: EssentialContactDataModel = {
			name: entity.name,
			description: entity.description,
			color: entity.color,
		}

		if (entity.treatmentLocalIds) {
			const treatments = await TreatmentService.getAllByLocalIds(
				entity.treatmentLocalIds,
			)
			model.treatmentIds = treatments
				.filter(treatment => hasValue(treatment.id))
				.map(treatment => treatment.id!)
		}

		return model
	}

	public async getUserEssentialContacts(settings?: UserSettingsEntity) {
		const universalContactsPromise = this.getUniversalEssentialContacts()
		const treatmentContactPromise = this.getTreatmentEssentialContacts(settings)
		const results = await Promise.all([
			universalContactsPromise,
			treatmentContactPromise,
		])
		return [...results[0], ...results[1]]
	}

	private async getUniversalEssentialContacts(): Promise<
		EssentialContactEntity[]
	> {
		return this.table.where('isUniversal').equals(TRUE).toArray()
	}

	async getTreatmentEssentialContacts(
		settings?: UserSettingsEntity,
	): Promise<EssentialContactEntity[]> {
		if (settings && hasValue(settings.treatmentLocalId)) {
			return this.toList(
				this.table
					.where('treatmentLocalIds')
					.equals(settings.treatmentLocalId!),
			)
		} else return []
	}

	async removeTreatment(treatment: TreatmentEntity) {
		if (hasValue(treatment.localId)) {
			const essentialContacts = await this.getTreatmentNonUniversalEContacts(
				treatment.localId!,
			)

			const acum = essentialContacts.reduce(
				(acum, ec) => {
					ec.treatmentLocalIds = ec.treatmentLocalIds?.filter(
						t => t !== treatment.localId,
					)

					acum[
						ArrayUtils.isNotEmpty(ec.treatmentLocalIds) ? 'toSave' : 'toDelete'
					].push(ec)

					return acum
				},
				{ toSave: [], toDelete: [] } as removeTreatmentAcumType,
			)

			await Promise.all([
				this.saveAll(acum.toSave),
				this.deleteAll(acum.toDelete),
			])
		}
	}

	private getTreatmentNonUniversalEContacts = async (
		treatmentLocalId: number,
	) => {
		return await this.toList(
			this.table
				.where('treatmentLocalIds')
				.equals(treatmentLocalId)
				.filter(ec => ec.isUniversal === FALSE),
		)
	}
}

export default new EssentialContactServiceImpl()
