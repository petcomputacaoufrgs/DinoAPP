import React from "react"
import FilterIcon from '@material-ui/icons/FilterList';
import { Checkbox, FormControlLabel, IconButton, Menu } from '@material-ui/core'
import { useLanguage } from "../../../context/language"
import './styles.css'
import DinoFilterListProps from "./props"
import FilterType from "../../../types/filter/Filter"
import FilterService from "../../../storage/local_storage/filter/FilterService"

const DinoFilterList: React.FC<DinoFilterListProps> = (props) => {

  const language = useLanguage()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleClose = () => setAnchorEl(null)

  const handleChangeFilterValue = (filter: FilterType, index: number) => {
    props.onChangeChecked(index)
    FilterService.setFilter(filter.id, filter.checked)
  }

  return (
    <div className='filterlist'>
      <IconButton onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}>
        <FilterIcon fontSize='small'/>
        <div className='filterlist__label'>{language.data.FILTER}</div>
      </IconButton>
      <Menu
        id="fade-menu"
        className="filterlist__menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={open}
        keepMounted
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
      {props.filters.map((f, index) => 
        <FormControlLabel
          key={index}
          control={<Checkbox checked={f.checked} onChange={e => handleChangeFilterValue(f, index)} />}
          label={f.label}
        />
      )}
      </Menu>
    </div>
  )
}

export default DinoFilterList