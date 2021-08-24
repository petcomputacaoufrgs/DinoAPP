import React, { useState, useRef, useEffect } from 'react'
import DrawerNavigationProps from './props'
import './styles.css'
import Drawer from './drawer'
import Content from './content'

const DRAWER_WIDTH = 240
const MIN_MOVE_TO_OPEN_DRAWER = 20

const DrawerNavigation: React.FC<DrawerNavigationProps> = ({
	groupedItems,
	component,
}): JSX.Element => {
	const drawerEl = useRef<HTMLDivElement | null>(null)

	const [startTouch, setStartTouch] = useState<HorizontalTouch | undefined>(
		undefined,
	)

	const [menuScrollBlocked, setMenuScrollBlocked] = useState(false)

	const [open, setOpen] = useState(false)

	useEffect(() => {
		function handleTouchStart(this: GlobalEventHandlers, event: TouchEvent) {
			if (menuScrollBlocked) {
				return
			}

			const touch = getTouch(event)
			if (touch) {
				if (scrollingAnotherElement(event)) {
					setMenuScrollBlocked(true)
				} else {
					setStartTouch(touch)
					disableDivTransition(drawerEl)
				}
			}
		}

		function handleTouchEnd(this: GlobalEventHandlers, event: TouchEvent) {
			if (menuScrollBlocked) {
				setMenuScrollBlocked(false)
				return
			}

			enableDivTransition(drawerEl)

			const currentTouch = getTouch(event)

			if (currentTouch && startTouch) {
				const diff = calcSwipeDiff(currentTouch)

				if (diff > DRAWER_WIDTH / 2) {
					openDrawer(drawerEl)
					if (!open) {
						handleDrawerOpen()
					}
				} else {
					closeDrawer(drawerEl)
					if (open) {
						handleDrawerClose()
					}
				}
			}

			setStartTouch(undefined)
		}

		function handleTouchMove(this: GlobalEventHandlers, event: TouchEvent) {
			const currentTouch = getTouch(event)
			if (startTouch && currentTouch) {
				const diff = calcSwipeDiff(currentTouch)
				if (diff > MIN_MOVE_TO_OPEN_DRAWER) {
					const translateX = diff

					if (translateX >= DRAWER_WIDTH) {
						openDrawer(drawerEl)
						disableDivTransition(drawerEl)
					} else {
						changeDivTransform(drawerEl, `translate3d(${translateX}px, 0, 0)`)
						disableDivTransition(drawerEl)
					}
				}
			}
		}

		if (drawerEl && drawerEl.current) {
			drawerEl.current.addEventListener('touchstart', handleTouchStart, {
				passive: true,
			})
			drawerEl.current.addEventListener('touchend', handleTouchEnd, {
				passive: true,
			})
			drawerEl.current.addEventListener('touchmove', handleTouchMove, {
				passive: true,
			})
		}

		const cleanBeforeUpdate = () => {
			if (drawerEl && drawerEl.current) {
				drawerEl.current.removeEventListener(
					'touchstart',
					handleTouchStart,
					false,
				)
				drawerEl.current.removeEventListener('touchend', handleTouchEnd, false)
				drawerEl.current.removeEventListener(
					'touchmove',
					handleTouchMove,
					false,
				)
			}
		}

		return cleanBeforeUpdate
	})

	useEffect(() => {
		enableDivTransition(drawerEl)

		if (open) {
			openDrawer(drawerEl)
		} else {
			closeDrawer(drawerEl)
		}
	}, [open])

	const calcSwipeDiff = (currentTouch: HorizontalTouch): number => {
		const touchDiff = currentTouch.x - startTouch!.x

		if (open) {
			return touchDiff + DRAWER_WIDTH
		}
		return touchDiff
	}

	const handleDrawerOpen = () => {
		setOpen(true)
	}

	const handleDrawerClose = () => {
		setOpen(false)
	}

	return (
		<div className='drawer_navigation'>
			<div className='drawer_navigation__box' ref={drawerEl}>
				<Drawer
					groupedItems={groupedItems}
					onClose={handleDrawerClose}
					open={open}
				/>
				<Content component={component} onDrawerOpen={handleDrawerOpen} />
			</div>
		</div>
	)
}

export default DrawerNavigation

interface HorizontalTouch {
	x: number
}

const getTouch = (event: TouchEvent): HorizontalTouch | undefined => {
	const touches = event.touches
	if (touches.length > 0) {
		return {
			x: touches[0].clientX,
		}
	} else {
		const changedTouches = event.changedTouches
		if (changedTouches.length > 0) {
			return {
				x: changedTouches[0].clientX,
			}
		}
	}

	return undefined
}

const scrollingAnotherElement = (event: TouchEvent): boolean => {
	if (event.composedPath) {
		const path = event.composedPath()

		return path.some(target => {
			const el = target as HTMLElement

			//Dataset used to define draggable elements that can conflict with drawer
			if (el.getAttribute && el.getAttribute('data-dino-draggable')) {
				return true
			}

			return el.scrollLeft !== undefined && el.scrollLeft > 0
		})
	}

	return false
}

const openDrawer = (divEl: React.MutableRefObject<HTMLDivElement | null>) => {
	let deslocation: number
	window.innerWidth > window.innerHeight ? deslocation = 20 : deslocation = 15
	changeDivTransform(divEl, `translate3d(${deslocation}rem, 0, 0)`)
}

const closeDrawer = (divEl: React.MutableRefObject<HTMLDivElement | null>) => {
	changeDivTransform(divEl, 'translate3d(0px, 0, 0)')
}

const enableDivTransition = (
	divEl: React.MutableRefObject<HTMLDivElement | null>,
) => {
	if (divEl && divEl.current) {
		divEl.current.style.transition = 'transform 150ms'
	}
}

const disableDivTransition = (
	divEl: React.MutableRefObject<HTMLDivElement | null>,
) => {
	if (divEl && divEl.current) {
		divEl.current.style.transition = 'transform 0ms'
	}
}

const changeDivTransform = (
	divEl: React.MutableRefObject<HTMLDivElement | null>,
	value: string,
) => {
	if (divEl && divEl.current) {
		divEl.current.style.transform = value
	}
}
