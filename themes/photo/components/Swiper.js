import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

// Swiper组件，接收包含多个post对象的数组
const Swiper = ({ posts }) => {
  // 状态管理当前显示的卡片索引
  const [currentIndex, setCurrentIndex] = useState(0)
  // 引用容器元素，用于直接访问DOM节点
  const containerRef = useRef(null)

  // 存储拖拽开始时的位置和滚动位置
  const touchStartPos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const scrollStartLeft = useRef(0) // 记录拖拽开始时的滚动位置

  // 处理鼠标和触摸开始事件
  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX // 获取触摸或鼠标的X位置
    touchStartPos.current = { x } // 记录开始时的X位置
    isDragging.current = true // 标记为正在拖拽
    scrollStartLeft.current = containerRef.current.scrollLeft // 记录开始拖拽时的滚动位置

    // 更新鼠标样式，显示为抓取状态
    containerRef.current.style.cursor = 'grabbing'
  }

  // 处理鼠标和触摸移动事件
  const handleDragMove = e => {
    if (!isDragging.current) return // 如果未处于拖拽状态，直接返回

    const x = e.touches ? e.touches[0].clientX : e.clientX // 获取当前的X位置
    const deltaX = touchStartPos.current.x - x // 计算拖动的距离

    // 根据拖动的距离更新滚动位置
    containerRef.current.scrollLeft = scrollStartLeft.current + deltaX
  }

  // 处理鼠标和触摸结束事件
  const handleDragEnd = () => {
    isDragging.current = false // 标记为非拖拽状态
    containerRef.current.style.cursor = 'grab' // 恢复鼠标样式
  }

  // 处理指示器点击事件，更新当前显示的索引
  const handleIndicatorClick = index => {
    setCurrentIndex(index) // 更新当前索引
    scrollToCard(index) // 滚动到对应的卡片
  }

  // 滚动到特定卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.scrollWidth / posts.length // 计算每个卡片的宽度
    container.scrollTo({
      left: index * cardWidth - cardWidth / 6, // 调整位置使卡片居中
      behavior: 'smooth' // 使用平滑滚动
    })
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 左侧控制按钮 */}
      <div
        className='absolute inset-y-0 left-0 w-12 z-10 cursor-pointer bg-black hover:opacity-20 opacity-10 duration-100'
        onClick={() =>
          handleIndicatorClick(
            currentIndex === 0 ? posts.length - 1 : currentIndex - 1 // 如果当前是第一个，则回到最后一个；否则，显示前一个
          )
        }></div>

      {/* 右侧控制按钮 */}
      <div
        className='absolute inset-y-0 right-0 w-12 z-10 cursor-pointer bg-black hover:opacity-20 opacity-10 duration-100'
        onClick={() =>
          handleIndicatorClick(
            currentIndex === posts.length - 1 ? 0 : currentIndex + 1 // 如果当前是最后一个，则回到第一个；否则，显示下一个
          )
        }></div>

      {/* 滑动区域 */}
      <div
        ref={containerRef} // 绑定引用
        className='relative w-full overflow-x-hidden py-4 cursor-grab' // 设置滑动区域的样式
        onTouchStart={handleDragStart} // 处理触摸开始事件
        onTouchMove={handleDragMove} // 处理触摸移动事件
        onTouchEnd={handleDragEnd} // 处理触摸结束事件
        onMouseDown={handleDragStart} // 处理鼠标按下事件
        onMouseMove={handleDragMove} // 处理鼠标移动事件
        onMouseUp={handleDragEnd} // 处理鼠标松开事件
        onMouseLeave={handleDragEnd} // 处理鼠标离开事件
        style={{ WebkitOverflowScrolling: 'touch' }}> {/* 使在iOS上滚动更顺滑 */}
        <div className='flex gap-x-4 transition-transform'>
          {/* 遍历每个文章对象并渲染PostItemCard */}
          {posts.map((item, index) => (
            <div key={index} className='w-3/4 flex-shrink-0'>
              <PostItemCard post={item} /> {/* 渲染每个卡片 */}
            </div>
          ))}
        </div>
      </div>

      {/* 指示器 */}
      <div className='absolute bottom-0 left-0 right-0 flex justify-center space-x-2'>
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)} // 点击指示器滚动到对应卡片
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? 'bg-black dark:bg-white' // 当前选中的指示器样式
                : 'bg-gray-300 dark:bg-gray-700' // 未选中的指示器样式
            }`}></button>
        ))}
      </div>
    </div>
  )
}

export default Swiper
