import LazyImage from '@/components/LazyImage' // 引入懒加载图片组件，用于优化图片加载
import NotionIcon from '@/components/NotionIcon' // 引入Notion图标组件，用于显示文章图标
import { siteConfig } from '@/lib/config' // 引入站点配置
import { useGlobal } from '@/lib/global' // 引入全局状态钩子
import { formatDateFmt } from '@/lib/utils/formatDate' // 引入日期格式化函数，用于格式化文章发布日期

/**
 * 普通的博客卡片组件
 * 带封面图
 */
const PostItemCard = ({ post }) => {
  const { siteInfo } = useGlobal() // 使用全局状态获取站点信息
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover // 获取文章的封面图缩略图或站点默认封面图

  return (
    <div key={post.id} className='mb-6 max-w-screen-3xl'>
      {/* 卡片容器，设置底部边距和最大宽度 */}
      <div className='flex flex-col space-y-3 relative'>
        {/* 封面图片区域 */}
        <div className='w-full h-3/4 aspect-video overflow-hidden mb-2'>
          <LazyImage
            alt={post?.title} // 图片替代文字为文章标题
            src={cover} // 图片来源，使用封面图或默认封面图
            style={cover ? {} : { height: '0px' }} // 如果没有封面图，设置图片高度为0
            className='w-full h-3/4 aspect-video object-cover select-none pointer-events-none' // 设置图片宽高比例、覆盖方式，禁用选择和点击
          />
        </div>

        {/* 文章标题和日期区域 */}
        <div className='absolute bottom-0'>
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
