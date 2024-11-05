import { useRef, useState, useEffect } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0) // 当前卡片索引
  const containerRef = useRef(null) // 滚动容器引用
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight) // 判断是否为横屏

  // 监听窗口大小变化，用于检测横屏/竖屏状态
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight) // 更新屏幕方向状态
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 拖拽相关引用变量
  const touchStartPos = useRef({ x: 0, y: 0 }) // 记录拖拽的起始位置
  const isDragging = useRef(false) // 是否处于拖拽状态
  const scrollStartLeft = useRef(0) // 记录拖拽开始时的滚动位置

  // 处理拖拽开始
  const handleDragStart = e => {
    // 禁用横屏设备的拖拽功能
    if (isLandscape) return
    const x = e.touches ? e.touches[0].clientX : e.clientX // 获取X坐标
    touchStartPos.current = { x }
    isDragging.current = true
    scrollStartLeft.current = containerRef.current.scrollLeft
    containerRef.current.style.cursor = 'grabbing'
  }

  // 处理拖拽移动
  const handleDragMove = e => {
    if (!isDragging.current) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const deltaX = touchStartPos.current.x - x
    containerRef.current.scrollLeft = scrollStartLeft.current + deltaX
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    containerRef.current.style.cursor = 'grab'

    // 计算最近的卡片索引
    const container = containerRef.current
    const cardWidth = container.offsetWidth // 卡片的宽度
    const scrollLeft = container.scrollLeft // 当前滚动位置
    const newIndex = Math.round(scrollLeft / cardWidth) // 计算最近的索引
    setCurrentIndex(newIndex)
    scrollToCard(newIndex) // 滚动到最近的卡片
  }

  // 滚动到指定索引的卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth // 取容器的宽度，即单个卡片宽度
    const scrollPosition = index * cardWidth // 计算目标卡片的起始位置
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    })
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
      {/* 左侧箭头按钮（竖屏时隐藏） */}
      {!isLandscape && (
        <div
          className='absolute inset-y-0 left-4 z-10 cursor-pointer flex items-center justify-center'
          onClick={handlePrev}>
          <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10094;</span>
        </div>
      )}

      {/* 右侧箭头按钮（竖屏时隐藏） */}
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
            <div key={index} className='w-full flex-shrink-0'> {/* 设置宽度为100% */}
              <PostItemCard post={item} /> {/* 渲染每个卡片 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
