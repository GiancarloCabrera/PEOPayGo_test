import { Typography } from '@mui/material'
import React from 'react'

const AccessDenied = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      }}>
      <iframe src="https://giphy.com/embed/3og0ItKLUOUzt5uwZW" width="280" height="280" frameBorder="0" allowFullScreen></iframe>
      <Typography variant="h4">
        Access Denied!!!
      </Typography>
    </div>
  )
}

export default AccessDenied
