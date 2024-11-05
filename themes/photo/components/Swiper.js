import { useRef, useState, useEffect } from 'react'
import PostItemCard from './PostItemCard'

// 主 Swiper 组件，用于展示主要图片
const MainSwiper = ({ posts, currentIndex, setCurrentIndex }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    scrollToCard(currentIndex)
  }, [currentIndex])

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
    <div ref={containerRef} className='relative w-full overflow-x-hidden py-4'>
      <div className='flex gap-x-4 transition-transform'>
        {posts.map((item, index) => (
          <div key={index} className='w-3/4 flex-shrink-0'>
            <PostItemCard post={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

// 导航 Swiper 组件，用于显示缩略图
const NavigationSwiper = ({ posts, currentIndex, setCurrentIndex }) => {
  const containerRef = useRef(null)

  const handleClick = index => {
    setCurrentIndex(index)
  }

  return (
    <div ref={containerRef} className='relative w-full overflow-x-auto py-2'>
      <div className='flex gap-x-2'>
        {posts.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`cursor-pointer w-24 h-16 flex-shrink-0 overflow-hidden border-2 ${
              currentIndex === index ? 'border-black' : 'border-transparent'
            }`}>
            <img
              src={item.pageCoverThumbnail}
              alt={item.title}
              className='w-full h-full object-cover'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// 包含主 Swiper 和导航 Swiper 的容器组件
const SwiperContainer = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === posts.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [posts.length])

  return (
    <div className='w-full mx-auto'>
      <MainSwiper
        posts={posts}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <NavigationSwiper
        posts={posts}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  )
}

export default SwiperContainer
