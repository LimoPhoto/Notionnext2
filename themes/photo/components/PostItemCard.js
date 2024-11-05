import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'

/**
 * 普通的博客卡牌
 * 仅展示封面图，按图片自身比例显示
 */
const PostItemCard = ({ post }) => {
  const { siteInfo } = useGlobal()
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover
  return (
    <div key={post.id} className='mb-6 max-w-screen-3xl'>
      <div className='relative'>
        {/* 封面图显示，按自身比例展示 */}
        <div className='w-full overflow-hidden mb-2'>
          <LazyImage
            alt={post?.title}
            src={cover}
            style={cover ? {} : { height: '0px' }}
            className='w-full object-contain select-none pointer-events-none'
          />
        </div>
      </div>
    </div>
  )
}

export default PostItemCard
