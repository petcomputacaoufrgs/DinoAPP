import React from 'react'
import { InputAdornment, TextField, IconButton } from '@material-ui/core/'
import { Search } from '@material-ui/icons/'
import './styles.css'
import { useLanguage } from '../../context/language'

interface SearchBarProps {
	value: string
	onChange: (event: any) => void
	placeholder?: string
}

const DinoSearchBar = (props: SearchBarProps) => {

	const language = useLanguage()
	
	return (
		<div className='mui-search-bar'>
			<TextField
				fullWidth
				variant='outlined'
				value={props.value}
				onChange={props.onChange}
				aria-describedby='search-bar'
				size='small'
				placeholder={props.placeholder || language.data.SEARCH_HOLDER}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<IconButton>
								<Search />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</div>
	)
}

export default DinoSearchBar
