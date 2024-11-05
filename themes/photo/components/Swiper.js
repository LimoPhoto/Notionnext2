import { useRef, useEffect } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    // 自动轮播功能
    const interval = setInterval(() => {
      if (containerRef.current) {
        const cardWidth = containerRef.current.scrollWidth / posts.length
        containerRef.current.scrollLeft += cardWidth
        if (containerRef.current.scrollLeft >= containerRef.current.scrollWidth - cardWidth) {
          containerRef.current.scrollLeft = 0 // 循环轮播
        }
      }
    }, 3000) // 3秒间隔

    // 清除定时器以防止内存泄漏
    return () => clearInterval(interval)
  }, [posts.length])

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      {/* 滑动区域 */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4'
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
    </div>
  )
}

export default Swiper
