export default interface OptionsIconButtonProps {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
	lum?: "light" | "dark"
	bigger?: boolean
}
