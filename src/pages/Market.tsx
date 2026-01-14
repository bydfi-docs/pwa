import { useState, useEffect } from 'react'
import '../App.css'

interface MarketItem {
  id: string
  name: string
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

function Market() {
  // 生成模拟市场数据
  const generateMarketData = (): MarketItem[] => {
    const symbols = [
      { name: '比特币', symbol: 'BTC' },
      { name: '以太坊', symbol: 'ETH' },
      { name: '币安币', symbol: 'BNB' },
      { name: '索拉纳', symbol: 'SOL' },
      { name: '瑞波币', symbol: 'XRP' },
      { name: '狗狗币', symbol: 'DOGE' },
      { name: '艾达币', symbol: 'ADA' },
      { name: '波卡', symbol: 'DOT' },
      { name: '莱特币', symbol: 'LTC' },
      { name: '链环', symbol: 'LINK' },
    ]

    return symbols.map((item) => {
      const basePrice = 10000 + Math.random() * 50000
      const change = (Math.random() - 0.5) * 2000
      const changePercent = (change / basePrice) * 100

      return {
        id: item.symbol,
        name: item.name,
        symbol: item.symbol,
        price: basePrice,
        change: change,
        changePercent: changePercent,
        volume: Math.random() * 1000000000,
      }
    })
  }

  const [markets, setMarkets] = useState<MarketItem[]>(generateMarketData())

  useEffect(() => {

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

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(2)}B`
    }
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`
    }
    return `${(volume / 1000).toFixed(2)}K`
  }

  return (
    <div className="page market-page">
      <div className="market-header-banner">
        <div className="banner-decoration"></div>
        <div className="banner-content">
          <div className="banner-icon">📊</div>
          <div className="banner-text">
            <h1 className="banner-title">实时行情</h1>
            <p className="banner-subtitle">全球加密货币市场动态</p>
          </div>
        </div>
        <div className="market-stats-row">
          <div className="stat-box">
            <span className="stat-label">24h成交量</span>
            <span className="stat-value">$2.4T</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">市场占有率</span>
            <span className="stat-value">BTC 45%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">涨跌比</span>
            <span className="stat-value positive">↑ 6:4</span>
          </div>
        </div>
      </div>

      <div className="market-container">
        <div className="market-list">
          {markets.map((item) => (
            <div key={item.id} className="market-item">
              <div className="market-item-left">
                <div className="market-symbol">
                  <span className="market-name">{item.name}</span>
                  <span className="market-code">{item.symbol}</span>
                </div>
              </div>
              <div className="market-item-right">
                <div className="market-price">
                  <div className="price-value">${formatPrice(item.price)}</div>
                  <div className={`price-change ${item.change >= 0 ? 'up' : 'down'}`}>
                    {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.changePercent).toFixed(2)}%
                  </div>
                </div>
                <div className="market-volume">
                  24h量: {formatVolume(item.volume)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Market
