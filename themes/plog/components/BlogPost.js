import { compressImage } from '@/lib/notion/mapImage'
import Link from 'next/link'
import { usePlogGlobal } from '..'
import { isMobile } from '@/lib/utils'
import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'

/**
 * 博客照片卡牌
 * @param {*} props
 * @returns
 */
const BlogPost = (props) => {
  const { post, index, siteInfo } = props
  const pageThumbnail = compressImage(post?.pageCoverThumbnail || siteInfo?.pageCover)
  const { setModalContent, setShowModal } = usePlogGlobal()
  const handleClick = () => {
    setShowModal(true)
    setModalContent(post)
  }

  // 实现动画 一个接一个出现
  let delay = index * 100
  if (isMobile()) {
    delay = 0
  }

  return (
       <article
  onClick={handleClick}
  data-aos-delay={`${delay}`}
  data-aos="fade-up"
  key={post?.id} 
  className='cursor-pointer relative'>

  {/* 关键修改：移除 aspect-ratio 和 object-cover，改用自然尺寸 */}
  <LazyImage 
    src={pageThumbnail} 
    className='w-full h-auto ' 
  />

 
  
 
</article>

  )
}

export default BlogPost
