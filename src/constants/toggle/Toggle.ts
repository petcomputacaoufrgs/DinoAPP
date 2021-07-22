import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	firstLogin: true,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: true,
	showTreatmentQuestionButtonToStaff: true,
	overridePermission: {
		override: true,
		permission: PermissionEnum.USER,
	},
	testAll2048Pieces: false,
}
