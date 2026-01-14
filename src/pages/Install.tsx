import { useState, useEffect } from 'react'
import '../App.css'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  
  // 设备和浏览器信息
  const [isIOS, setIsIOS] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [browserName, setBrowserName] = useState('')
  const [browserVersion, setBrowserVersion] = useState('')

  useEffect(() => {
    const checkEnvironment = () => {
      const ua = navigator.userAgent

      // 检测设备类型
      const ios = /iPad|iPhone|iPod/.test(ua) && !ua.includes('CriOS')
      const android = /Android/.test(ua) && !/X11|Macintosh|Windows/.test(ua)
      const desktop = !ios && !android

      setIsIOS(ios)
      setIsDesktop(desktop)

      // 检测浏览器
      let name = '未知浏览器'
      let version = ''
      
      if (ua.includes('Chrome') && !ua.includes('Edg')) {
        name = 'Chrome'
        const match = ua.match(/Chrome\/([\d.]+)/)
        version = match ? match[1] : ''
      } else if (ua.includes('Edg')) {
        name = 'Edge'
        const match = ua.match(/Edg\/([\d.]+)/)
        version = match ? match[1] : ''
      } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        name = 'Safari'
        const match = ua.match(/Version\/([\d.]+)/)
        version = match ? match[1] : ''
      } else if (ua.includes('Firefox')) {
        name = 'Firefox'
        const match = ua.match(/Firefox\/([\d.]+)/)
        version = match ? match[1] : ''
      }

      setBrowserName(name)
      setBrowserVersion(version)

      // 检测是否在独立模式（已安装）
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true
      setIsStandalone(standalone)

      // 异步检测是否已安装
      if ('getInstalledRelatedApps' in navigator) {
        (navigator as any).getInstalledRelatedApps()
          .then((apps: any[]) => setIsInstalled(apps.length > 0))
          .catch((error: any) => console.log('检测已安装应用失败:', error))
      }

      console.log('环境检测:', { ios, android, desktop, name, version, standalone })
    }

    checkEnvironment()

    // 监听安装提示事件
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎉 收到 beforeinstallprompt 事件!!!')
      console.log('事件对象:', e)
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
      console.log('✅ deferredPrompt 已保存，可以安装了！')
    }

    const handleAppInstalled = () => {
      console.log('🎉 应用已安装！')
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    console.log('📡 开始监听 beforeinstallprompt 事件...')
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    
    // 检查是否已经有事件在等待
    setTimeout(() => {
      console.log('⏱️ 3秒后检查: deferredPrompt =', !!deferredPrompt)
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    console.log('🔵 点击安装按钮')
    console.log('📊 当前状态:', { 
      有deferredPrompt: !!deferredPrompt,
      isInstallable,
      isInstalled,
      isStandalone,
      browserName,
      设备类型: isIOS ? 'iOS' : isDesktop ? 'Desktop' : 'Android'
    })
    
    // 如果有 deferredPrompt，使用它
    if (deferredPrompt) {
      console.log('✅ 使用原生安装对话框')
      try {
        const promptResult = await deferredPrompt.prompt()
        console.log('prompt() 返回:', promptResult)
        
        const { outcome } = await deferredPrompt.userChoice
        console.log('用户选择:', outcome)
        
        if (outcome === 'accepted') {
          console.log('✅ 用户接受安装')
        } else {
          console.log('❌ 用户取消安装')
        }

        setDeferredPrompt(null)
        setIsInstallable(false)
      } catch (error) {
        console.error('❌ 安装过程出错:', error)
        alert('安装失败，请查看控制台')
      }
    } else {
      // 没有 deferredPrompt，显示手动安装提示
      console.warn('⚠️ 没有 deferredPrompt，显示手动提示')
      console.log('可能原因: beforeinstallprompt 事件未触发')
      alert('🔔 安装提示\n\n请点击浏览器右上角菜单 ⋮\n选择 "安装应用" 或 "添加到主屏幕"')
    }
  }

  // 获取安装指南文本
  const getInstallGuideText = () => {
    if (isInstalled || isStandalone) {
      return {
        icon: '✅',
        title: '应用已安装',
        description: '您已经成功安装了此应用，可以从桌面直接启动'
      }
    }

    if (isIOS) {
      return {
        icon: '🍎',
        title: 'iOS 安装指引',
        description: '点击 Safari 底部的"分享"按钮 ⎙，然后选择"添加到主屏幕"即可安装'
      }
    }

    if (isDesktop && (browserName === 'Chrome' || browserName === 'Edge')) {
      return {
        icon: '💻',
        title: '桌面安装指引',
        description: '在浏览器地址栏右侧找到安装图标 ⊕，点击即可安装。或通过浏览器菜单选择"安装应用"'
      }
    }

    if (browserName === 'Firefox') {
      return {
        icon: '🦊',
        title: 'Firefox 支持有限',
        description: 'Firefox 对PWA的支持有限，建议使用 Chrome 或 Edge 浏览器获得最佳体验'
      }
    }

    return {
      icon: 'ℹ️',
      title: '需要支持的浏览器',
      description: '请使用 Chrome、Edge 或 Safari 浏览器访问以安装此应用'
    }
  }

  // 极简判断：只要不是已安装或独立模式，就可以点击
  const canInstall = !isInstalled && !isStandalone

  const guideInfo = getInstallGuideText()

  // 商店风格
  return (
    <div className="page app-store-page">
      <div className="app-store-container">
        {/* 头部 */}
        <div className="app-store-header">
          <h1 className="app-store-title">商店</h1>
        </div>

        <div className="app-store-content">
          {/* 应用信息卡片 */}
          <div className="app-info-section">
            <div className="app-icon-large">
              <img
                src={`${import.meta.env.BASE_URL}pwa-512x512.png`}
                alt="App Icon"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.innerHTML = '<div style="font-size: 3rem;">📱</div>'
                }}
              />
            </div>
            <div className="app-details">
              <h2 className="app-name">交易所 Demo</h2>
              <p className="app-developer">PWA Demo Team</p>
              <div className="app-badges">
                <span className="badge-item">
                  <span className="badge-label">编辑精选</span>
                </span>
                <span className="badge-item badge-ads-free">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  无广告
                </span>
              </div>
            </div>
          </div>

          {/* 评分和信息栏 */}
          <div className="app-stats-bar">
            <div className="stat-item">
              <div className="stat-value">4.8<span className="star-icon">★</span></div>
              <div className="stat-label">1.2K 条评价</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">5万+</div>
              <div className="stat-label">下载量</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">内容分级</div>
              <div className="stat-label">3岁以上</div>
            </div>
          </div>

          {/* 安装按钮区 */}
          <div className="install-section">
            <button
              className={`install-button ${!canInstall ? 'disabled' : ''}`}
              onClick={handleInstallClick}
              disabled={!canInstall}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="install-icon">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              <span className="button-text">
                {isInstalled || isStandalone ? '已安装' : '安装'}
              </span>
            </button>
            <button className="wishlist-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <button className="share-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
          </div>

          {/* 此应用提供 */}
          <div className="app-provides-section">
            <h3>此应用提供</h3>
            <div className="provides-list">
              <div className="provide-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>应用内购买</span>
              </div>
            </div>
          </div>

          {/* 评分与评价 */}
          <div className="ratings-section">
            <div className="ratings-header">
              <h3>评分和评价</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
            <div className="ratings-overview">
              <div className="rating-score">
                <div className="score-number">4.8</div>
                <div className="stars">★★★★★</div>
                <div className="reviews-count">1.2K 条评价</div>
              </div>
              <div className="rating-bars">
                <div className="rating-bar-item">
                  <span className="bar-label">5</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div className="rating-bar-item">
                  <span className="bar-label">4</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{width: '15%'}}></div>
                  </div>
                </div>
                <div className="rating-bar-item">
                  <span className="bar-label">3</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{width: '4%'}}></div>
                  </div>
                </div>
                <div className="rating-bar-item">
                  <span className="bar-label">2</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{width: '2%'}}></div>
                  </div>
                </div>
                <div className="rating-bar-item">
                  <span className="bar-label">1</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{width: '1%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 截图预览 */}
          <div className="screenshots-section">
            <h3>屏幕截图</h3>
            <div className="screenshots-grid">
              <div className="screenshot-item">
                <img src={`${import.meta.env.BASE_URL}screenshots/home.png`} alt="首页" />
              </div>
              <div className="screenshot-item">
                <img src={`${import.meta.env.BASE_URL}screenshots/market.png`} alt="行情" />
              </div>
              <div className="screenshot-item">
                <img src={`${import.meta.env.BASE_URL}screenshots/trade.png`} alt="交易" />
              </div>
              <div className="screenshot-item">
                <img src={`${import.meta.env.BASE_URL}screenshots/assets.png`} alt="资产" />
              </div>
            </div>
          </div>

          {/* 应用描述 */}
          <div className="app-description-section">
            <h3>关于此应用</h3>
            <div className="app-description-content">
              <p>交易所 Demo 是一款简洁美观的数字货币交易平台，为您提供实时行情、快捷交易和安全的资产管理服务。我们致力于打造极致的用户体验，让数字资产交易变得前所未有的简单和高效。</p>
              <div className="feature-chips">
                <span className="feature-chip">⚡ 秒开启动</span>
                <span className="feature-chip">📴 离线可用</span>
                <span className="feature-chip">🔔 实时推送</span>
                <span className="feature-chip">🔒 安全可靠</span>
              </div>
            </div>
          </div>

          {/* 最新动态 */}
          <div className="whats-new-section">
            <div className="section-header-with-arrow">
              <h3>最新动态</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
            <div className="update-info">
              <div className="update-version">版本 1.0.0</div>
              <div className="update-date">2026年1月15日</div>
            </div>
            <div className="update-notes">
              <p>• 全新的交易界面设计</p>
              <p>• 优化了行情数据加载速度</p>
              <p>• 修复了已知问题，提升稳定性</p>
            </div>
          </div>

          {/* 数据安全 */}
          <div className="data-safety-section">
            <div className="section-header-with-arrow">
              <h3>数据安全</h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </div>
            <p className="safety-intro">了解开发者如何声明收集和使用您的数据</p>
            <div className="safety-items">
              <div className="safety-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <div className="safety-text">
                  <div className="safety-title">未与第三方分享数据</div>
                  <div className="safety-desc">详细了解开发者如何声明分享数据</div>
                </div>
              </div>
              <div className="safety-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <div className="safety-text">
                  <div className="safety-title">数据已加密传输</div>
                  <div className="safety-desc">数据在传输过程中已加密</div>
                </div>
              </div>
            </div>
          </div>

          {/* 应用信息 */}
          <div className="app-info-details">
            <h3>应用信息</h3>
            <div className="info-item">
              <span>提供方</span>
              <span>PWA Demo Team</span>
            </div>
            <div className="info-item">
              <span>大小</span>
              <span>&lt; 1 MB</span>
            </div>
            <div className="info-item">
              <span>下载量</span>
              <span>5万+</span>
            </div>
            <div className="info-item">
              <span>类别</span>
              <span>金融</span>
            </div>
            <div className="info-item">
              <span>兼容性</span>
              <span>{browserName} {browserVersion}</span>
            </div>
            <div className="info-item">
              <span>发布日期</span>
              <span>2026年1月1日</span>
            </div>
          </div>

          {/* 底部安装指引（当不支持一键安装时显示） */}
          {!canInstall && (
            <div className="install-guide-bottom">
              <div className="guide-icon-large">{guideInfo.icon}</div>
              <h3 className="guide-title">{guideInfo.title}</h3>
              <p className="guide-description">{guideInfo.description}</p>
              
              {/* iOS详细步骤 */}
              {isIOS && !isInstalled && !isStandalone && (
                <div className="guide-steps-compact">
                  <div className="step-compact">
                    <span className="step-num">1</span>
                    <span className="step-text">点击底部分享按钮 ⎙</span>
                  </div>
                  <div className="step-compact">
                    <span className="step-num">2</span>
                    <span className="step-text">选择"添加到主屏幕"</span>
                  </div>
                  <div className="step-compact">
                    <span className="step-num">3</span>
                    <span className="step-text">点击"添加"完成安装</span>
                  </div>
                </div>
              )}

              {/* Desktop详细步骤 */}
              {isDesktop && (browserName === 'Chrome' || browserName === 'Edge') && !isInstalled && !isStandalone && (
                <div className="guide-steps-compact">
                  <div className="step-compact">
                    <span className="step-num">1</span>
                    <span className="step-text">在地址栏右侧找到安装图标 ⊕</span>
                  </div>
                  <div className="step-compact">
                    <span className="step-num">2</span>
                    <span className="step-text">点击图标，选择"安装"</span>
                  </div>
                  <div className="step-compact">
                    <span className="step-num">3</span>
                    <span className="step-text">应用将添加到您的系统中</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Install
