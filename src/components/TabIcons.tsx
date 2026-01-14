interface IconProps {
  isActive: boolean
}

// 首页图标 - 简化的房子，一笔画完
export const HomeIcon = ({ isActive }: IconProps) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" key={isActive ? 'active' : 'inactive'}>
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
        stroke={isActive ? 'url(#homeGradient)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={isActive ? '100 100' : 'none'}
        strokeDashoffset={isActive ? 100 : 0}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1.2s"
            fill="freeze"
          />
        )}
      </path>
      <path
        d="M9 21V14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14V21"
        stroke={isActive ? 'url(#homeGradient2)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={isActive ? '30 30' : 'none'}
        strokeDashoffset={isActive ? 30 : 0}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            from="30"
            to="0"
            dur="0.5s"
            begin="0.8s"
            fill="freeze"
          />
        )}
      </path>
      {isActive && (
        <defs>
          <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#f093fb" />
            <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
          </linearGradient>
          <linearGradient id="homeGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#667eea" />
          </linearGradient>
        </defs>
      )}
    </svg>
  )
}

// 行情图标 - 折线图，从左到右绘制
export const MarketIcon = ({ isActive }: IconProps) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" key={isActive ? 'active' : 'inactive'}>
      <path
        d="M3 18L7 14L11 16L15 10L19 13L21 11"
        stroke={isActive ? 'url(#marketGradient)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={isActive ? '100 100' : 'none'}
        strokeDashoffset={isActive ? 100 : 0}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1.5s"
            fill="freeze"
          />
        )}
      </path>
      {/* 数据点 */}
      {isActive && (
        <>
          <circle cx="3" cy="18" r="0" fill="#667eea">
            <animate attributeName="r" from="0" to="2.5" dur="0.3s" begin="0.2s" fill="freeze" />
          </circle>
          <circle cx="7" cy="14" r="0" fill="#764ba2">
            <animate attributeName="r" from="0" to="2.5" dur="0.3s" begin="0.5s" fill="freeze" />
          </circle>
          <circle cx="11" cy="16" r="0" fill="#f093fb">
            <animate attributeName="r" from="0" to="2.5" dur="0.3s" begin="0.8s" fill="freeze" />
          </circle>
          <circle cx="15" cy="10" r="0" fill="#667eea">
            <animate attributeName="r" from="0" to="2.5" dur="0.3s" begin="1.1s" fill="freeze" />
          </circle>
          <circle cx="19" cy="13" r="0" fill="#764ba2">
            <animate attributeName="r" from="0" to="2.5" dur="0.3s" begin="1.3s" fill="freeze" />
          </circle>
          <circle cx="21" cy="11" r="0" fill="#f093fb">
            <animate attributeName="r" from="0" to="2.5" dur="0.3s" begin="1.5s" fill="freeze" />
          </circle>
        </>
      )}
      {isActive && (
        <defs>
          <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#f093fb" />
            <animate attributeName="x1" values="0%;-50%;0%" dur="2s" repeatCount="indefinite" />
            <animate attributeName="x2" values="100%;150%;100%" dur="2s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
      )}
    </svg>
  )
}

// 交易图标 - 圆形箭头，更明显的路径
export const TradeIcon = ({ isActive }: IconProps) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" key={isActive ? 'active' : 'inactive'}>
      {/* 上半圆箭头 */}
      <path
        d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12"
        stroke={isActive ? 'url(#tradeGradientTop)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={isActive ? '50 50' : 'none'}
        strokeDashoffset={isActive ? 50 : 0}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            from="50"
            to="0"
            dur="0.8s"
            fill="freeze"
          />
        )}
      </path>
      {/* 下半圆箭头 */}
      <path
        d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12"
        stroke={isActive ? 'url(#tradeGradientBottom)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={isActive ? '50 50' : 'none'}
        strokeDashoffset={isActive ? 50 : 0}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            from="50"
            to="0"
            dur="0.8s"
            begin="0.3s"
            fill="freeze"
          />
        )}
      </path>
      {/* 箭头 */}
      <path
        d="M20 9L20 12L17 12"
        stroke={isActive ? '#10b981' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isActive ? 0 : 1}
      >
        {isActive && (
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.8s" fill="freeze" />
        )}
      </path>
      <path
        d="M4 15L4 12L7 12"
        stroke={isActive ? '#ef4444' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={isActive ? 0 : 1}
      >
        {isActive && (
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.1s" fill="freeze" />
        )}
      </path>
      {isActive && (
        <defs>
          <linearGradient id="tradeGradientTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399">
              <animate attributeName="stop-color" values="#34d399;#10b981;#34d399" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <linearGradient id="tradeGradientBottom" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f87171">
              <animate attributeName="stop-color" values="#f87171;#ef4444;#f87171" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      )}
    </svg>
  )
}

// 资产图标 - 钱币符号，清晰的圆圈和$符号
export const AssetsIcon = ({ isActive }: IconProps) => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" key={isActive ? 'active' : 'inactive'}>
      {/* 外圆 */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={isActive ? 'url(#assetsGradient)' : 'currentColor'}
        strokeWidth="2.5"
        fill="none"
        strokeDasharray={isActive ? '57 57' : 'none'}
        strokeDashoffset={isActive ? 57 : 0}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            from="57"
            to="0"
            dur="1s"
            fill="freeze"
          />
        )}
      </circle>
      
      {/* 美元符号S形 */}
      <path
        d="M15 8C15 6.89543 14.1046 6 13 6H11C9.89543 6 9 6.89543 9 8C9 9.10457 9.89543 10 11 10H13C14.1046 10 15 10.8954 15 12C15 13.1046 14.1046 14 13 14H11C9.89543 14 9 13.1046 9 12"
        stroke={isActive ? 'url(#assetsGradient2)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={isActive ? '40 40' : 'none'}
        strokeDashoffset={isActive ? 40 : 0}
      >
        {isActive && (
          <animate
            attributeName="stroke-dashoffset"
            from="40"
            to="0"
            dur="0.8s"
            begin="0.5s"
            fill="freeze"
          />
        )}
      </path>
      
      {/* 上下两条线 */}
      <line
        x1="12"
        y1="4"
        x2="12"
        y2="6"
        stroke={isActive ? 'url(#assetsGradient2)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={isActive ? 0 : 1}
      >
        {isActive && (
          <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin="1.3s" fill="freeze" />
        )}
      </line>
      <line
        x1="12"
        y1="14"
        x2="12"
        y2="16"
        stroke={isActive ? 'url(#assetsGradient2)' : 'currentColor'}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={isActive ? 0 : 1}
      >
        {isActive && (
          <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin="1.3s" fill="freeze" />
        )}
      </line>
      
      {isActive && (
        <defs>
          <linearGradient id="assetsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#f093fb" />
            <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
          </linearGradient>
          <linearGradient id="assetsGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b">
              <animate attributeName="stop-color" values="#f59e0b;#ef4444;#f59e0b" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ef4444">
              <animate attributeName="stop-color" values="#ef4444;#f59e0b;#ef4444" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      )}
    </svg>
  )
}
