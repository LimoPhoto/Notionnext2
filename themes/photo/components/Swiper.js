import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  // 处理点击事件，根据点击位置决定滑动方向
  const handleClick = e => {
    const container = containerRef.current
    if (!container) return
    const containerWidth = container.offsetWidth
    const clickX = e.clientX

    // 判断点击位置是否在左半部分或右半部分
    if (clickX < containerWidth / 2) {
      handlePrev() // 点击左侧则向左滑动
    } else {
      handleNext() // 点击右侧则向右滑动
    }
  }

  // 滑动到指定卡片
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
      {/* 滑动区域，监听点击事件 */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4 cursor-pointer'
        onClick={handleClick} // 处理点击事件
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

      {/* 底部指示器 */}
      <div className='absolute bottom-0 left-0 right-0 flex justify-center space-x-2'>
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? 'bg-black dark:bg-white'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}></button>
        ))}
      </div>
    </div>
  )
}

export default Swiper
