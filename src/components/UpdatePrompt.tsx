import { useState, useEffect } from 'react'
import './UpdatePrompt.css'

interface UpdatePromptProps {
  onUpdate: () => void
}

function UpdatePrompt({ onUpdate }: UpdatePromptProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // 延迟显示，避免加载时突兀
    const timer = setTimeout(() => setShow(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="update-prompt-overlay">
      <div className="update-prompt">
        <div className="update-icon">🚀</div>
        <div className="update-content">
          <h3 className="update-title">发现新版本</h3>
          <p className="update-message">
            应用有新版本可用，更新后可以获得最新功能和体验优化
          </p>
        </div>
        <div className="update-actions">
          <button 
            className="update-btn update-btn-primary" 
            onClick={onUpdate}
          >
            立即更新
          </button>
          <button 
            className="update-btn update-btn-secondary" 
            onClick={() => setShow(false)}
          >
            稍后提醒
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePrompt
