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

  // 处理点击事件，根据点击位置决定向左还是向右滑动
  const handleClick = e => {
    const container = containerRef.current
    if (!container) return

    // 获取点击位置和容器宽度
    const clickX = e.clientX
    const containerRect = container.getBoundingClientRect()
    const containerMidX = containerRect.left + containerRect.width / 2

    if (clickX < containerMidX) {
      handlePrev() // 点击左侧，向左滑动
    } else {
      handleNext() // 点击右侧，向右滑动
    }
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 滑动区域 */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4 cursor-pointer'
        style={{ WebkitOverflowScrolling: 'touch' }}
        onClick={handleClick}> {/* 监听点击事件 */}
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
