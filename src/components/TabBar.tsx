import { useNavigate, useLocation } from 'react-router-dom'
import { HomeIcon, MarketIcon, TradeIcon, AssetsIcon } from './TabIcons'
import '../App.css'

interface TabItem {
  path: string
  label: string
  icon: React.ComponentType<{ isActive: boolean }>
}

const tabs: TabItem[] = [
  { path: '/', label: '首页', icon: HomeIcon },
  { path: '/market', label: '行情', icon: MarketIcon },
  { path: '/trade', label: '交易', icon: TradeIcon },
  { path: '/assets', label: '资产', icon: AssetsIcon },
]

function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    // 详情页不激活任何标签
    if (location.pathname.startsWith('/detail')) {
      return false
    }
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isActive(tab.path)
        return (
          <button
            key={tab.path}
            className={`tab-item ${active ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-icon">
              <Icon isActive={active} />
            </span>
            <span className="tab-label">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default TabBar
