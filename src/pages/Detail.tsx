import { useNavigate, useParams, useLocation } from 'react-router-dom'
import '../App.css'

function Detail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const item = location.state?.item

  if (!item) {
    return (
      <div className="page detail-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/list')}>
            ← 返回
          </button>
          <h1>详情</h1>
          <div className="header-spacer"></div>
        </div>
        <div className="content">
          <div className="card">
            <p>未找到数据</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page detail-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/list')}>
          ← 返回
        </button>
        <h1>详情</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="content">
        <div className="detail-card">
          <div className="detail-header">
            <span className="detail-category">{item.category}</span>
            <span className="detail-time">{item.timestamp}</span>
          </div>
          
          <h2 className="detail-title">{item.title}</h2>
          
          <div className="detail-content">
            <p>{item.description}</p>
            <p>
              这是详情页面的扩展内容。在 PWA 应用中，页面切换应该流畅自然，
              就像原生应用一样。这里展示了如何通过路由实现页面导航。
            </p>
            <p>
              项目 ID: <strong>#{item.id}</strong>
            </p>
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary">编辑</button>
            <button className="btn btn-secondary">分享</button>
            <button className="btn btn-reset">删除</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
