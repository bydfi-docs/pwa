import { useState } from 'react'
import '../App.css'

interface TradeItem {
  symbol: string
  name: string
  price: number
  change: number
}

function Trade() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [amount, setAmount] = useState('')
  const [total, setTotal] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')

  const tradePairs: TradeItem[] = [
    { symbol: 'BTC/USDT', name: '比特币', price: 45230.50, change: 2.34 },
    { symbol: 'ETH/USDT', name: '以太坊', price: 2845.80, change: -1.23 },
    { symbol: 'BNB/USDT', name: '币安币', price: 425.60, change: 3.45 },
    { symbol: 'SOL/USDT', name: '索拉纳', price: 98.75, change: 5.67 },
  ]

  const currentPair = tradePairs.find(p => p.symbol === selectedPair) || tradePairs[0]

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (value && !isNaN(Number(value))) {
      setTotal((Number(value) * currentPair.price).toFixed(2))
    } else {
      setTotal('')
    }
  }

  const handleTotalChange = (value: string) => {
    setTotal(value)
    if (value && !isNaN(Number(value))) {
      setAmount((Number(value) / currentPair.price).toFixed(8))
    } else {
      setAmount('')
    }
  }

  const handleTrade = () => {
    if (!amount || !total) {
      alert('请输入交易数量')
      return
    }
    alert(`${tradeType === 'buy' ? '买入' : '卖出'} ${amount} ${selectedPair.split('/')[0]} 成功！`)
    setAmount('')
    setTotal('')
  }

  return (
    <div className="page trade-page">
      <div className="trade-header-banner">
        <div className="banner-decoration-left"></div>
        <div className="banner-decoration-right"></div>
        <div className="trade-banner-content">
          <div className="trade-header-top">
            <div className="trade-icon-wrapper">
              <div className="trade-icon">💱</div>
            </div>
            <div className="trade-header-info">
              <h1 className="trade-title">快捷交易</h1>
              <p className="trade-subtitle">简单快速，安全可靠</p>
            </div>
          </div>
          <div className="trade-features">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span className="feature-text">极速成交</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span className="feature-text">安全保障</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💎</span>
              <span className="feature-text">0手续费</span>
            </div>
          </div>
        </div>
      </div>

      <div className="trade-container">
        {/* 交易对选择 */}
        <div className="trade-pair-selector">
          <div className="selector-header">
            <span className="selector-label">交易对</span>
          </div>
          <div className="pair-list">
            {tradePairs.map((pair) => (
              <button
                key={pair.symbol}
                className={`pair-item ${selectedPair === pair.symbol ? 'active' : ''}`}
                onClick={() => setSelectedPair(pair.symbol)}
              >
                <div className="pair-info">
                  <span className="pair-symbol">{pair.symbol}</span>
                  <span className="pair-name">{pair.name}</span>
                </div>
                <div className="pair-stats">
                  <span className="pair-price">${pair.price.toLocaleString()}</span>
                  <span className={`pair-change ${pair.change >= 0 ? 'up' : 'down'}`}>
                    {pair.change >= 0 ? '+' : ''}{pair.change}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 价格信息卡片 */}
        <div className="price-info-card">
          <div className="price-info-header">
            <h2>{currentPair.name}</h2>
            <span className="current-symbol">{currentPair.symbol}</span>
          </div>
          <div className="price-display">
            <span className="price-value-large">${currentPair.price.toLocaleString()}</span>
            <span className={`change-badge ${currentPair.change >= 0 ? 'up' : 'down'}`}>
              {currentPair.change >= 0 ? '↗' : '↘'} {Math.abs(currentPair.change)}%
            </span>
          </div>
        </div>

        {/* 交易类型切换 */}
        <div className="trade-type-selector">
          <button
            className={`trade-type-btn ${tradeType === 'buy' ? 'active buy' : ''}`}
            onClick={() => setTradeType('buy')}
          >
            买入
          </button>
          <button
            className={`trade-type-btn ${tradeType === 'sell' ? 'active sell' : ''}`}
            onClick={() => setTradeType('sell')}
          >
            卖出
          </button>
        </div>

        {/* 交易表单 */}
        <div className="trade-form">
          <div className="form-group">
            <label className="form-label">
              <span>数量</span>
              <span className="form-unit">{currentPair.symbol.split('/')[0]}</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00000000"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>

          <div className="form-divider">
            <span className="divider-icon">×</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>金额</span>
              <span className="form-unit">USDT</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={total}
              onChange={(e) => handleTotalChange(e.target.value)}
            />
          </div>

          <button
            className={`trade-submit-btn ${tradeType}`}
            onClick={handleTrade}
          >
            {tradeType === 'buy' ? '买入' : '卖出'} {currentPair.symbol.split('/')[0]}
          </button>
        </div>

        {/* 快速操作 */}
        <div className="quick-amounts">
          <span className="quick-label">快速选择：</span>
          <div className="quick-btns">
            {['25%', '50%', '75%', '100%'].map((percent) => (
              <button
                key={percent}
                className="quick-btn"
                onClick={() => handleAmountChange('0.1')}
              >
                {percent}
              </button>
            ))}
          </div>
        </div>

        {/* 最近成交 */}
        <div className="recent-trades">
          <h3 className="section-title">最近成交</h3>
          <div className="trades-list">
            <div className="trades-header">
              <span>时间</span>
              <span>价格(USDT)</span>
              <span>数量</span>
            </div>
            {[
              { time: '14:32:15', price: currentPair.price + 50, amount: 0.023, type: 'buy' },
              { time: '14:32:08', price: currentPair.price - 20, amount: 0.145, type: 'sell' },
              { time: '14:31:55', price: currentPair.price + 30, amount: 0.089, type: 'buy' },
              { time: '14:31:42', price: currentPair.price - 10, amount: 0.234, type: 'sell' },
              { time: '14:31:28', price: currentPair.price + 15, amount: 0.067, type: 'buy' },
            ].map((trade, index) => (
              <div key={index} className="trade-row">
                <span className="trade-time">{trade.time}</span>
                <span className={`trade-price ${trade.type}`}>
                  {trade.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="trade-amount">{trade.amount.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 市场深度预览 */}
        <div className="market-depth-preview">
          <h3 className="section-title">市场深度</h3>
          <div className="depth-chart">
            <div className="depth-side buy-side">
              <div className="depth-label">
                <span>买入</span>
                <span className="depth-total">52.3%</span>
              </div>
              <div className="depth-bar" style={{ width: '52.3%' }}></div>
            </div>
            <div className="depth-side sell-side">
              <div className="depth-label">
                <span>卖出</span>
                <span className="depth-total">47.7%</span>
              </div>
              <div className="depth-bar" style={{ width: '47.7%' }}></div>
            </div>
          </div>
        </div>

        {/* 交易提示 */}
        <div className="trade-tips">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <p className="tip-title">安全交易</p>
            <p className="tip-text">平台采用银行级加密技术，资金安全有保障</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trade
