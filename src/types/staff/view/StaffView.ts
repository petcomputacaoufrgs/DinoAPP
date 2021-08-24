import StaffEntity from "../database/StaffEntity"

export default interface StaffView {
	isStaff: StaffEntity,
	acceptedInvitation: boolean
}
