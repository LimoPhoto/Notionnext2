import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'

/**
 * 文章页脚
 * @param {*} props
 * @returns
 */
export default function ArticleFooter(props) {
  const { post } = props
  const { locale } = useGlobal()

  return (
    <>
      {/* 分类和标签部分 */}
      <div className='flex gap-3 font-semibold text-sm items-center justify-center'>
        {/* 分类标签（如果文章不是“页面”类型） */}
        {post?.type !== 'Page' && (
          <>
            <Link
              href={`/category/${post?.category}`}
              passHref
              className='cursor-pointer text-md mr-2 text-green-500'>
              {post?.category}
            </Link>
          </>
        )}

        {/* 标签部分（若文章有标签） */}
        <div className='flex py-1 space-x-3'>
          {post?.tags?.length > 0 && (
            <>
              {locale.COMMON.TAGS} <span>:</span>
            </>
          )}
          {/* 显示所有标签 */}
          {post?.tags?.map(tag => {
            return (
              <Link
                href={`/tag/${tag}`}
                key={tag}
                className='text-yellow-500 mr-2'>
                {tag}
              </Link>
            )
          })}
        </div>
      </div>

      {/* 发布日期信息 */}
      {/* 将发布日期信息定位在页面右侧，并确保下划线长度与日期文字相同 */}
      <div className='text-right mt-4 mr-2'>
        <Link
          href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
          passHref
          className='cursor-pointer'
          style={{
            fontSize: '12px', // 设置字体大小为 12px
            fontWeight: '300', // 设置字体粗细为细体
            color: 'gray', // 设置文字颜色为灰色
            borderBottom: '1px solid gray', // 为日期文字添加下划线
            display: 'inline-block' // 使下划线长度与文字相同
          }}>
          {post?.publishDay}
        </Link>
      </div>
    </>
  )
}
