import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  pageTitle: string;
}

const PageTitle = ({ pageTitle }: Props) => {
  return (
    <div style={{ padding: '5px 0' }}>
      <Typography variant='h3'>
        {pageTitle}
      </ Typography>
    </div>
  )
}

export default PageTitle
