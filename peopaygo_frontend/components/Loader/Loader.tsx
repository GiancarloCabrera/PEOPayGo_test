import React from 'react'

const Loader = () => {
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
      <iframe src="https://giphy.com/embed/RpiluMNIFyTHkHIupg" width="150" height="150" frameBorder="0" allowFullScreen></iframe>
    </div>
  )
}

export default Loader
