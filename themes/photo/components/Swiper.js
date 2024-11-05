import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  // 处理拖拽事件
  const touchStartPos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const scrollStartLeft = useRef(0)

  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    touchStartPos.current = { x }
    isDragging.current = true
    scrollStartLeft.current = containerRef.current.scrollLeft
    containerRef.current.style.cursor = 'grabbing'
  }

  const handleDragMove = e => {
    if (!isDragging.current) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const deltaX = touchStartPos.current.x - x
    containerRef.current.scrollLeft = scrollStartLeft.current + deltaX
  }

  const handleDragEnd = () => {
    isDragging.current = false
    containerRef.current.style.cursor = 'grab'
  }

  // 滚动到指定索引的卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.scrollWidth / posts.length
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    })
  }

  // 处理左右箭头的点击
  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : posts.length - 1
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % posts.length
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 左侧箭头 */}
      <div
        className='absolute inset-y-0 left-0 z-10 cursor-pointer flex items-center justify-center text-3xl'
        onClick={handlePrev}
      >
        &#9664; {/* 左箭头符号 */}
      </div>

      {/* 右侧箭头 */}
      <div
        className='absolute inset-y-0 right-0 z-10 cursor-pointer flex items-center justify-center text-3xl'
        onClick={handleNext}
      >
        &#9654; {/* 右箭头符号 */}
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
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className='flex gap-x-4 transition-transform'>
          {posts.map((item, index) => (
            <div key={index} className='w-3/4 flex-shrink-0'>
              <PostItemCard post={item} /> {/* 渲染卡片 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
