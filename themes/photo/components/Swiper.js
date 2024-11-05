import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0) // 当前显示的卡片索引
  const containerRef = useRef(null) // 用于引用滑动区域容器

  // 拖拽相关引用变量，用于记录开始位置和滚动状态
  const touchStartPos = useRef({ x: 0, y: 0 }) // 记录拖拽的起始位置
  const isDragging = useRef(false) // 记录是否处于拖拽状态
  const scrollStartLeft = useRef(0) // 记录拖拽开始时的滚动位置

  // 处理拖拽开始
  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX // 记录鼠标或触摸的X坐标
    touchStartPos.current = { x } // 保存X坐标到起始位置
    isDragging.current = true // 标记正在拖拽
    scrollStartLeft.current = containerRef.current.scrollLeft // 记录当前滚动位置
    containerRef.current.style.cursor = 'grabbing' // 更改鼠标样式
  }

  // 处理拖拽移动
  const handleDragMove = e => {
    if (!isDragging.current) return // 如果没有拖拽状态，退出
    const x = e.touches ? e.touches[0].clientX : e.clientX // 获取当前X坐标
    const deltaX = touchStartPos.current.x - x // 计算拖动的距离
    containerRef.current.scrollLeft = scrollStartLeft.current + deltaX // 更新滚动位置
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    isDragging.current = false // 标记拖拽结束
    containerRef.current.style.cursor = 'grab' // 恢复鼠标样式
  }

  // 滚动到指定索引的卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return // 如果没有找到容器，则返回
    const cardWidth = container.scrollWidth / posts.length // 计算每个卡片的宽度
    container.scrollTo({
      left: index * cardWidth, // 滚动到指定索引的卡片位置
      behavior: 'smooth', // 使用平滑滚动
    })
  }

  // 处理点击左箭头，滚动到前一个卡片
  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : posts.length - 1 // 如果是第一个卡片，滚动到最后一个
    setCurrentIndex(newIndex) // 更新当前索引
    scrollToCard(newIndex) // 滚动到新索引的卡片
  }

  // 处理点击右箭头，滚动到下一个卡片
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % posts.length // 如果是最后一个卡片，循环回到第一个
    setCurrentIndex(newIndex) // 更新当前索引
    scrollToCard(newIndex) // 滚动到新索引的卡片
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 左侧箭头按钮 */}
      <div
        className='absolute inset-y-0 left-4 z-10 cursor-pointer flex items-center justify-center'
        onClick={handlePrev} // 调用handlePrev函数
      >
        <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10094;</span> {/* 左箭头 */}
      </div>

      {/* 右侧箭头按钮 */}
      <div
        className='absolute inset-y-0 right-4 z-10 cursor-pointer flex items-center justify-center'
        onClick={handleNext} // 调用handleNext函数
      >
        <span className='text-3xl text-gray-700 hover:text-gray-900'>&#10095;</span> {/* 右箭头 */}
      </div>

      {/* 滑动区域 */}
      <div
        ref={containerRef} // 滑动区域引用
        className='relative w-full overflow-x-hidden py-4 cursor-grab' // 设置滑动区域的样式
        onTouchStart={handleDragStart} // 处理触摸拖拽开始事件
        onTouchMove={handleDragMove} // 处理触摸拖拽移动事件
        onTouchEnd={handleDragEnd} // 处理触摸拖拽结束事件
        onMouseDown={handleDragStart} // 处理鼠标拖拽开始事件
        onMouseMove={handleDragMove} // 处理鼠标拖拽移动事件
        onMouseUp={handleDragEnd} // 处理鼠标拖拽结束事件
        onMouseLeave={handleDragEnd} // 鼠标离开时结束拖拽
        style={{ WebkitOverflowScrolling: 'touch' }} // 使在iOS设备上滚动更顺滑
      >
        <div className='flex gap-x-4 transition-transform'>
          {posts.map((item, index) => (
            <div key={index} className='w-3/4 flex-shrink-0'>
              <PostItemCard post={item} /> {/* 渲染每个卡片 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
