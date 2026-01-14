import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

interface ListItem {
  id: number
  title: string
  description: string
  category: string
  timestamp: string
}

function List() {
  const navigate = useNavigate()
  const [items, setItems] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef(1)

  // 生成模拟数据
  const generateItems = (page: number, count: number = 20): ListItem[] => {
    const categories = ['工作', '生活', '学习', '娱乐', '运动']
    const titles = [
      '重要任务提醒', '会议安排', '项目进度', '学习计划', '健身计划',
      '购物清单', '旅行规划', '读书笔记', '代码审查', '设计评审'
    ]
    
    return Array.from({ length: count }, (_, i) => {
      const id = (page - 1) * count + i + 1
      return {
        id,
        title: `${titles[id % titles.length]} #${id}`,
        description: `这是第 ${id} 条列表项的详细描述信息，展示了长列表滚动效果。`,
        category: categories[id % categories.length],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')
      }
    })
  }

  // 加载更多数据
  const loadMore = () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    // 模拟网络请求延迟
    setTimeout(() => {
      const newItems = generateItems(pageRef.current)
      setItems(prev => {
        const updatedItems = [...prev, ...newItems]
        // 模拟数据加载完毕（假设最多 100 条）
        if (updatedItems.length >= 100) {
          setHasMore(false)
        }
        return updatedItems
      })
      pageRef.current += 1
      setLoading(false)
    }, 500)
  }

  // 初始化数据
  useEffect(() => {
    const initialItems = generateItems(1, 20)
    setItems(initialItems)
    pageRef.current = 2
  }, [])

  // 无限滚动
  useEffect(() => {
    if (!loadingRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(loadingRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, items.length])

  const handleItemClick = (item: ListItem) => {
    navigate(`/detail/${item.id}`, { state: { item } })
  }

  return (
    <div className="page list-page">
      <div className="page-header">
        <h1>长列表</h1>
        <div className="header-spacer"></div>
        <div className="header-spacer"></div>
      </div>

      <div className="list-container">
        <div className="list-stats">
          <span>共 {items.length} 条</span>
          {hasMore && <span className="loading-text">加载中...</span>}
        </div>

        <div className="list-items">
          {items.map((item) => (
            <div
              key={item.id}
              className="list-item"
              onClick={() => handleItemClick(item)}
            >
              <div className="list-item-header">
                <span className="item-category">{item.category}</span>
                <span className="item-time">{item.timestamp}</span>
              </div>
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="item-id">#{item.id}</span>
              </div>
            </div>
          ))}
        </div>

        <div ref={loadingRef} className="loading-indicator">
          {loading && <div className="spinner"></div>}
          {!hasMore && <div className="end-message">已加载全部内容</div>}
        </div>
      </div>
    </div>
  )
}

export default List
