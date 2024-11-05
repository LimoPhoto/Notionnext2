import { useRef, useState, useEffect } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 3000) // 3秒切换
    return () => clearInterval(interval)
  }, [])

  // 滚动到指定卡片，带动画效果
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.scrollWidth / posts.length
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    })
  }

  // 处理下一个卡片
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % posts.length
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  // 处理上一个卡片
  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + posts.length) % posts.length
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 左侧箭头 */}
      <div
        className='absolute inset-y-0 left-0 z-10 cursor-pointer flex items-center'
        onClick={handlePrev}>
        <span className='text-3xl'>&#9664;</span> {/* 左箭头图标 */}
      </div>

      {/* 右侧箭头 */}
      <div
        className='absolute inset-y-0 right-0 z-10 cursor-pointer flex items-center'
        onClick={handleNext}>
        <span className='text-3xl'>&#9654;</span> {/* 右箭头图标 */}
      </div>

      {/* 滑动区域 */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4'
        style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className='flex gap-x-4 transition-transform'>
          {/* 渲染每个卡片 */}
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
