import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

interface ImageItem {
  id: number
  title: string
  color: string
  height: number
}

function Gallery() {
  const navigate = useNavigate()
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)

  // 生成模拟图片数据
  useEffect(() => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea',
      '#ff9a9e', '#fecfef', '#ffecd2', '#fcb69f', '#ff8a80'
    ]
    
    const titles = [
      '风景', '城市', '自然', '建筑', '人物',
      '动物', '美食', '艺术', '科技', '运动'
    ]

    const items: ImageItem[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `${titles[i % titles.length]} ${i + 1}`,
      color: colors[i % colors.length],
      height: 150 + Math.random() * 100
    }))

    setImages(items)
  }, [])

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="page gallery-page">
      <div className="page-header">
        <h1>图片画廊</h1>
        <div className="header-spacer"></div>
        <div className="header-spacer"></div>
      </div>

      <div className="gallery-container">
        <div className="gallery-grid">
          {images.map((image) => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => handleImageClick(image)}
              style={{
                backgroundColor: image.color,
                height: `${image.height}px`
              }}
            >
              <div className="gallery-item-content">
                <span className="gallery-item-title">{image.title}</span>
                <span className="gallery-item-id">#{image.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div
              className="modal-image"
              style={{
                backgroundColor: selectedImage.color,
                height: '400px'
              }}
            >
              <div className="modal-image-content">
                <h2>{selectedImage.title}</h2>
                <p>ID: #{selectedImage.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
