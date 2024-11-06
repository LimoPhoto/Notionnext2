import { useRef, useState, useEffect } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0) // 当前卡片索引
  const containerRef = useRef(null) // 滚动容器引用
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight) // 是否为横屏状态

  // 监听窗口大小变化，用于检测横屏/竖屏状态
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // 竖屏时禁用页面上下滚动
    if (!isLandscape) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto' // 恢复正常滚动
    }

    // 清理函数，在组件卸载时重置滚动设置
    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.style.overflowY = 'auto'
    }
  }, [isLandscape])

  // 拖拽相关引用变量
  const touchStartPos = useRef(0) // 记录触摸的起始X位置
  const touchEndPos = useRef(0) // 记录触摸的结束X位置
  const isDragging = useRef(false) // 是否处于拖拽状态

  // 处理拖拽开始
  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    touchStartPos.current = x
    isDragging.current = true
  }

  // 处理拖拽移动
  const handleDragMove = e => {
    if (!isDragging.current) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    touchEndPos.current = x
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    const deltaX = touchStartPos.current - touchEndPos.current

    // 判断拖拽方向并滑动
    if (deltaX > 50) {
      handleNext()
    } else if (deltaX < -50) {
      handlePrev()
    }
  }

  // 使用 requestAnimationFrame 实现平滑滚动
  const smoothScrollTo = (targetPosition) => {
    const container = containerRef.current
    if (!container) return

    const startPosition = container.scrollLeft
    const distance = targetPosition - startPosition
    let startTime = null

    const animateScroll = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / 500, 1) // 500ms 过渡时间

      container.scrollLeft = startPosition + distance * progress

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // 滚动到指定索引的卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth
    const targetPosition = index * cardWidth
    smoothScrollTo(targetPosition)
  }

  // 处理点击左箭头
  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : posts.length - 1
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  // 处理点击右箭头
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % posts.length
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {!isLandscape && (
        <div
          className='absolute inset-y-0 left-4 z-10 cursor-pointer flex items-center justify-center'
          onClick={handlePrev}>
          <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10094;</span>
        </div>
      )}
      {!isLandscape && (
        <div
          className='absolute inset-y-0 right-4 z-10 cursor-pointer flex items-center justify-center'
          onClick={handleNext}>
          <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10095;</span>
        </div>
      )}

      {/* 滑动区域 */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4 cursor-grab flex justify-center'
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className='flex transition-transform' style={{ width: '100%' }}>
          {posts.map((item, index) => (
            <div key={index} className='w-full flex-shrink-0'>
              <PostItemCard post={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
