import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	forceFirstLogin: false,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: true,
	showTreatmentQuestionButtonToStaff: false,
	overridePermission: {
		override: false,
		permission: PermissionEnum.USER,
	},
	testAll2048Pieces: true,
}
