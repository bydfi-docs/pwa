import { useState, useEffect } from 'react'
import '../App.css'

interface AssetItem {
  symbol: string
  name: string
  balance: number
  value: number
  price: number
  change: number
}

function Assets() {
  const [totalValue, setTotalValue] = useState(0)
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [showZeroBalance, setShowZeroBalance] = useState(false)

  useEffect(() => {
    // 模拟资产数据
    const mockAssets: AssetItem[] = [
      { symbol: 'USDT', name: '泰达币', balance: 10000, price: 1, value: 10000, change: 0 },
      { symbol: 'BTC', name: '比特币', balance: 0.5, price: 45230.50, value: 22615.25, change: 2.34 },
      { symbol: 'ETH', name: '以太坊', balance: 5, price: 2845.80, value: 14229, change: -1.23 },
      { symbol: 'BNB', name: '币安币', balance: 10, price: 425.60, value: 4256, change: 3.45 },
      { symbol: 'SOL', name: '索拉纳', balance: 0, price: 98.75, value: 0, change: 5.67 },
      { symbol: 'XRP', name: '瑞波币', balance: 0, price: 0.52, value: 0, change: -2.1 },
    ]

    setAssets(mockAssets)
    setTotalValue(mockAssets.reduce((sum, asset) => sum + asset.value, 0))
  }, [])

  const displayAssets = showZeroBalance ? assets : assets.filter(a => a.balance > 0)

  return (
    <div className="page assets-page">
      <div className="assets-header">
        <div className="assets-header-content">
          <div className="total-value-section">
            <span className="total-label">总资产估值</span>
            <h1 className="total-value">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
            <span className="total-value-cny">≈ ¥{(totalValue * 7.2).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="asset-stats">
            <div className="stat-item">
              <span className="stat-label">24h收益</span>
              <span className="stat-value up">+$1,234.56</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">持仓币种</span>
              <span className="stat-value">{assets.filter(a => a.balance > 0).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="assets-container">
        <div className="assets-toolbar">
          <h2 className="assets-title">我的资产</h2>
          <label className="toggle-zero">
            <input
              type="checkbox"
              checked={showZeroBalance}
              onChange={(e) => setShowZeroBalance(e.target.checked)}
            />
            <span>显示零余额</span>
          </label>
        </div>

        <div className="assets-list">
          {displayAssets.map((asset) => (
            <div key={asset.symbol} className="asset-item">
              <div className="asset-icon">
                <span className="asset-symbol-icon">{asset.symbol[0]}</span>
              </div>
              <div className="asset-info">
                <div className="asset-main">
                  <span className="asset-name">{asset.name}</span>
                  <span className="asset-symbol-text">{asset.symbol}</span>
                </div>
                <div className="asset-balance">
                  <span className="balance-amount">{asset.balance.toFixed(8)}</span>
                  <span className={`balance-change ${asset.change >= 0 ? 'up' : 'down'}`}>
                    {asset.change >= 0 ? '↗' : '↘'} {Math.abs(asset.change)}%
                  </span>
                </div>
              </div>
              <div className="asset-value">
                <span className="value-usd">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="value-price">@${asset.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {displayAssets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <p className="empty-text">暂无资产</p>
            <p className="empty-hint">开始交易以查看您的资产</p>
          </div>
        )}

        {/* 资产分布 */}
        {displayAssets.length > 0 && (
          <div className="asset-distribution">
            <h3 className="distribution-title">资产分布</h3>
            <div className="distribution-chart">
              {displayAssets.map((asset, index) => {
                const percentage = (asset.value / totalValue) * 100
                return (
                  <div
                    key={asset.symbol}
                    className="chart-bar"
                    style={{
                      width: `${percentage}%`,
                      background: [
                        'linear-gradient(135deg, #667eea, #764ba2)',
                        'linear-gradient(135deg, #f093fb, #f5576c)',
                        'linear-gradient(135deg, #4facfe, #00f2fe)',
                        'linear-gradient(135deg, #43e97b, #38f9d7)',
                      ][index % 4],
                    }}
                  >
                    {percentage > 8 && (
                      <span className="bar-label">{asset.symbol}</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="distribution-legend">
              {displayAssets.map((asset, index) => (
                <div key={asset.symbol} className="legend-item">
                  <span
                    className="legend-color"
                    style={{
                      background: [
                        'linear-gradient(135deg, #667eea, #764ba2)',
                        'linear-gradient(135deg, #f093fb, #f5576c)',
                        'linear-gradient(135deg, #4facfe, #00f2fe)',
                        'linear-gradient(135deg, #43e97b, #38f9d7)',
                      ][index % 4],
                    }}
                  ></span>
                  <span className="legend-label">{asset.symbol}</span>
                  <span className="legend-value">
                    {((asset.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="assets-actions">
          <button className="action-btn deposit">
            <span className="action-icon">📥</span>
            <span>充值</span>
          </button>
          <button className="action-btn withdraw">
            <span className="action-icon">📤</span>
            <span>提现</span>
          </button>
          <button className="action-btn transfer">
            <span className="action-icon">🔄</span>
            <span>转账</span>
          </button>
        </div>

        {/* 快捷功能 */}
        <div className="quick-links">
          <a href="#" className="quick-link">
            <span className="link-icon">📊</span>
            <span className="link-text">交易记录</span>
          </a>
          <a href="#" className="quick-link">
            <span className="link-icon">📈</span>
            <span className="link-text">收益报告</span>
          </a>
          <a href="#" className="quick-link">
            <span className="link-icon">🔔</span>
            <span className="link-text">价格提醒</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Assets
