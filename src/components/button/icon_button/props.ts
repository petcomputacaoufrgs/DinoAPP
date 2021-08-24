import { SvgIconTypeMap } from '@material-ui/core'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import ButtonProps from '../props'

export default interface DinoIconButtonProps extends ButtonProps {
	icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | OverridableComponent<SvgIconTypeMap<{}, "svg">>
	lum?: "dark" | "light"
	bigger?: boolean,
	circular?: boolean
}
