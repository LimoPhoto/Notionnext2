import LazyImage from '@/components/LazyImage' // 引入懒加载图片组件，用于优化图片加载
import NotionIcon from '@/components/NotionIcon' // 引入Notion图标组件，用于显示文章图标
import { siteConfig } from '@/lib/config' // 引入站点配置
import { useGlobal } from '@/lib/global' // 引入全局状态钩子
import { formatDateFmt } from '@/lib/utils/formatDate' // 引入日期格式化函数，用于格式化文章发布日期
import { useRouter } from 'next/router' // 引入Next.js的useRouter钩子用于页面导航

/**
 * 普通的博客卡片组件
 * 带封面图、标题和日期
 */
const PostItemCard = ({ post }) => {
  const { siteInfo } = useGlobal() // 使用useGlobal钩子获取站点信息
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover // 如果文章没有封面图，使用站点默认封面图
  const router = useRouter() // 使用useRouter钩子获取Next.js的路由功能

  // 定义点击封面图片跳转的函数
  const handleClick = () => {
    router.push(post.href) // 使用router.push()跳转到文章详情页
  }

  return (
    <div key={post.id} className='mb-6 max-w-screen-3xl'>
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

        {/* 文章标题和日期区域 */}
        <div className='absolute bottom-0 p-4 bg-opacity-60 bg-white w-full'>
          <h2 className='select-none pointer-events-none'>
            {/* 如果站点配置了标题图标，显示Notion图标 */}
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} /> // 图标
            )}
            {post.title} {/* 显示文章标题 */}
          </h2>

          {/* 文章发布日期 */}
          <div className='text-sm select-none pointer-events-none'>
            {formatDateFmt(post.publishDate, 'yyyy-MM')} {/* 格式化并显示发布日期 */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItemCard // 导出PostItemCard组件
