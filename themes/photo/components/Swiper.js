import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  const touchStartPos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const scrollStartLeft = useRef(0) // 记录拖拽开始时的滚动位置

  // 处理鼠标和触摸开始事件
  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    touchStartPos.current = { x }
    isDragging.current = true
    scrollStartLeft.current = containerRef.current.scrollLeft
    containerRef.current.style.cursor = 'grabbing'
  }

  // 处理鼠标和触摸移动事件
  const handleDragMove = e => {
    if (!isDragging.current) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const deltaX = touchStartPos.current.x - x
    containerRef.current.scrollLeft = scrollStartLeft.current + deltaX
  }

  // 处理鼠标和触摸结束事件
  const handleDragEnd = () => {
    isDragging.current = false
    containerRef.current.style.cursor = 'grab'
  }

  // 处理指示器点击事件
  const handleIndicatorClick = index => {
    setCurrentIndex(index)
    scrollToCard(index)
  }

  // 滚动到特定卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.scrollWidth / posts.length
    container.scrollTo({
      left: index * cardWidth - cardWidth / 6,
      behavior: 'smooth'
    })
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 左侧箭头按钮 */}
      <div
        className='absolute inset-y-0 left-4 z-10 cursor-pointer flex items-center justify-center'
        onClick={() =>
          handleIndicatorClick(
            currentIndex === 0 ? posts.length - 1 : currentIndex - 1
          )
        }>
        <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10094;</span> {/* 左箭头 */}
      </div>

      {/* 右侧箭头按钮 */}
      <div
        className='absolute inset-y-0 right-4 z-10 cursor-pointer flex items-center justify-center'
        onClick={() =>
          handleIndicatorClick(
            currentIndex === posts.length - 1 ? 0 : currentIndex + 1
          )
        }>
        <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10095;</span> {/* 右箭头 */}
      </div>

      {/* 滑动区域 */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4 cursor-grab'
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className='flex gap-x-4 transition-transform'>
          {posts.map((item, index) => (
            <div key={index} className='w-3/4 flex-shrink-0'>
              <PostItemCard post={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
