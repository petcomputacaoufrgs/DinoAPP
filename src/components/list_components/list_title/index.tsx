import './styles.css'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

interface ListTitleProps {
  title: string | undefined
}

const ListTitle: React.FC<ListTitleProps> = ({title}): JSX.Element => 

  <div className='list__title'>
    <Typography>{title || ''}</Typography>
    <Divider />
  </div>

export default ListTitle
