function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizeClasses = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' }, 
    large: { width: '60px', height: '60px' }
  }

  return (
    <div className="loading-spinner">
      <div className="spinner" style={sizeClasses[size]}></div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  )
}

export default LoadingSpinner