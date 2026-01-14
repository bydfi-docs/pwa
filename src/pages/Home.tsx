import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
}

function Home() {
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [canInstall, setCanInstall] = useState(false)

  // 检测是否可以显示安装入口
  useEffect(() => {
    const checkInstallability = async () => {
      // 检测是否在独立模式（已安装）
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true
      
      // 检测是否已安装
      let isInstalled = false
      if ('getInstalledRelatedApps' in navigator) {
        const apps = await (navigator as any).getInstalledRelatedApps()
        isInstalled = apps.length > 0
      }

      // 只在未安装时显示入口
      setCanInstall(!isStandalone && !isInstalled)
    }

    checkInstallability()

    // 监听安装事件
    const handleAppInstalled = () => {
      setCanInstall(false)
    }

    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // 生成模拟市场数据
    const generateMarkets = (): MarketData[] => {
      const symbols = [
        { name: '比特币', symbol: 'BTC' },
        { name: '以太坊', symbol: 'ETH' },
        { name: '币安币', symbol: 'BNB' },
        { name: '索拉纳', symbol: 'SOL' },
        { name: '瑞波币', symbol: 'XRP' },
        { name: '狗狗币', symbol: 'DOGE' },
        { name: '艾达币', symbol: 'ADA' },
        { name: '波卡', symbol: 'DOT' },
      ]

      return symbols.map((item) => {
        const basePrice = 10000 + Math.random() * 50000
        const change = (Math.random() - 0.5) * 2000
        const changePercent = (change / basePrice) * 100

        return {
          symbol: item.symbol,
          name: item.name,
          price: basePrice,
          change: change,
          changePercent: changePercent,
          volume: Math.random() * 1000000000,
        }
      })
    }

    setMarkets(generateMarkets())

    // 模拟实时更新
    const interval = setInterval(() => {
      setMarkets(prev => prev.map(item => {
        const change = (Math.random() - 0.5) * 100
        const newPrice = Math.max(1000, item.price + change)
        const changePercent = ((newPrice - item.price) / item.price) * 100

        return {
          ...item,
          price: newPrice,
          change: newPrice - item.price,
          changePercent: changePercent,
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  // 计算市场统计
  const totalMarketCap = markets.reduce((sum, m) => sum + m.price * m.volume, 0)
  const gainers = markets.filter(m => m.changePercent > 0).length
  const losers = markets.filter(m => m.changePercent < 0).length

  return (
    <div className="page exchange-page">
      <div className="exchange-header">
        <div className="exchange-header-top">
          <div className="exchange-title">
            <h1>交易市场</h1>
            <div className="header-badges">
              <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
                <span className="status-dot-small"></span>
                {isOnline ? '在线' : '离线'}
              </div>
              {canInstall && (
                <button 
                  className="install-entry-btn" 
                  onClick={() => navigate('/install')}
                  title="安装应用到桌面"
                >
                  <span className="install-icon">📱</span>
                  <span className="install-text">安装应用</span>
                </button>
              )}
            </div>
          </div>
          <div className="market-overview">
            <div className="overview-item">
              <span className="overview-label">总市值</span>
              <span className="overview-value">${(totalMarketCap / 1e9).toFixed(2)}B</span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">24h交易量</span>
              <span className="overview-value">${(totalMarketCap / 1e8).toFixed(2)}M</span>
            </div>
            <div className="overview-divider"></div>
            <div className="overview-item">
              <span className="overview-label">涨跌比</span>
              <span className="overview-value">
                <span className="ratio-up">{gainers}↑</span>
                <span className="ratio-separator">/</span>
                <span className="ratio-down">{losers}↓</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="exchange-content">
        <div className="market-table">
          <div className="market-table-header">
            <div className="table-col-name">交易对</div>
            <div className="table-col-price">最新价</div>
            <div className="table-col-change">24h涨跌</div>
            <div className="table-col-volume">24h量</div>
          </div>
          <div className="market-table-body">
            {markets.map((item, index) => (
              <div key={item.symbol} className="market-table-row">
                <div className="table-col-name">
                  <span className="market-rank">#{index + 1}</span>
                  <div className="market-pair">
                    <span className="market-symbol-text">{item.symbol}</span>
                    <span className="market-name-text">{item.name}</span>
                  </div>
                </div>
                <div className="table-col-price">
                  <span className="price-main">${formatPrice(item.price)}</span>
                </div>
                <div className={`table-col-change ${item.changePercent >= 0 ? 'up' : 'down'}`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
                <div className="table-col-volume">
                  <span className="volume-value">${(item.volume / 1e6).toFixed(2)}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 市场热度指标 */}
        <div className="market-indicators">
          <div className="indicator-card">
            <div className="indicator-icon">🔥</div>
            <div className="indicator-info">
              <span className="indicator-label">热门交易对</span>
              <span className="indicator-value">BTC/USDT</span>
            </div>
          </div>
          <div className="indicator-card">
            <div className="indicator-icon">📈</div>
            <div className="indicator-info">
              <span className="indicator-label">24h最大涨幅</span>
              <span className="indicator-value green">+{Math.max(...markets.map(m => m.changePercent)).toFixed(2)}%</span>
            </div>
          </div>
          <div className="indicator-card">
            <div className="indicator-icon">💹</div>
            <div className="indicator-info">
              <span className="indicator-label">活跃币种</span>
              <span className="indicator-value">{markets.length}+</span>
            </div>
          </div>
        </div>

        <div className="market-footer">
          <button className="load-more-btn">
            <span>查看全部交易对</span>
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
