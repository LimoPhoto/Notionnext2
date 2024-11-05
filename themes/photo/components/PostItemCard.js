import { useEffect, useState } from 'react'
import LazyImage from '@/components/LazyImage' // 引入懒加载图片组件，用于优化图片加载
import { useGlobal } from '@/lib/global' // 引入全局状态钩子，用于访问站点的全局信息
import { useRouter } from 'next/router' // 引入Next.js的useRouter钩子用于页面导航

/**
 * 普通的博客卡片组件
 * 仅带封面图，保持比例和居中显示
 */
const PostItemCard = ({ post }) => {
  const { siteInfo } = useGlobal() // 使用useGlobal钩子获取站点信息
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover // 如果文章没有封面图，使用站点默认封面图
  const router = useRouter() // 使用useRouter钩子获取Next.js的路由功能
  const [isPortrait, setIsPortrait] = useState(window.innerWidth < window.innerHeight) // 检查是否为竖屏状态

  // 监听窗口大小变化，用于动态判断竖屏/横屏状态
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth < window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 定义点击封面图片跳转的函数
  const handleClick = () => {
    router.push(post.href) // 使用router.push()跳转到文章详情页
  }

  return (
    <div key={post.id} className={`mb-6 ${isPortrait ? 'px-4' : 'px-12'} max-w-screen-3xl`}>
      {/* 外层卡片容器，设置底部边距和最大宽度 */}
      <div className='flex flex-col space-y-3 relative'>
        {/* 封面图片区域，添加点击事件以跳转文章详情页 */}
        <div
          className='flex items-center justify-center w-full h-[400px] overflow-hidden mb-2 cursor-pointer' // 设置flex布局居中，限制高度为400px
          onClick={handleClick} // 点击封面图片跳转到文章详情页
        >
          <LazyImage
            alt={post?.title} // 设置图片的alt属性为文章标题
            src={cover} // 图片来源：封面图或默认封面图
            className='w-full h-full object-contain select-none' // 使用object-contain保持图片比例和完整显示，禁用选择
          />
        </div>
      </div>
    </div>
  )
}

export default PostItemCard // 导出PostItemCard组件，以便在其他地方使用
