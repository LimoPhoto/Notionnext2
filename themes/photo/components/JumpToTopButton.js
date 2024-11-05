import { useGlobal } from '@/lib/global'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal()

  // 隐藏跳跃至首页的箭头
  return null
}

export default JumpToTopButton
