import React, { useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import TagSearchBarProps from './props'
import { Search } from '@material-ui/icons'
import { InputAdornment, IconButton } from '@material-ui/core'
import { useLanguage } from '../../context/language'
import './styles.css'

const MAX_TAGS = 5

const TagSearchBar = (props: TagSearchBarProps): JSX.Element => {
	const language = useLanguage()

	const [tagList, setTagList] = useState<string[]>([])

	const handleChange = (event: React.ChangeEvent<{}>, values: any) => {
		if (values.length <= MAX_TAGS) {
			setTagList(values)
			props.onTagSearch(values)
		}
	}

	const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
		if (props.onTextSearch) {
			props.onTextSearch(value)
		}
	}

	return (
		<Autocomplete
			freeSolo
			multiple
			limitTags={1}
			loadingText={language.data.LOADING}
			noOptionsText={language.data.NO_OPTIONS}
			options={props.options}
			getOptionLabel={option => option}
			className='tag_search_bar'
			value={tagList}
			onChange={handleChange}
			onInputChange={handleInputChange}
			size='small'
			renderInput={params => (
				<TextField
					{...params}
					className={props.textFieldClass}
					placeholder={`${language.data.SEARCH_BUTTON_LABEL}`}
					variant='outlined'
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<>
								<InputAdornment position='start'>
									<IconButton>
										<Search />
									</IconButton>
								</InputAdornment>
								{params.InputProps.startAdornment}
							</>
						),
					}}
				/>
			)}
		/>
	)
}

export default TagSearchBar
