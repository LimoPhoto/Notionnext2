import Link from 'next/link' // 引入 Next.js 的 Link 组件，用于导航
import { useState } from 'react' // 从 React 中引入 useState 钩子

// 定义 MenuItemDrop 组件，用于显示单个导航菜单项
export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false) // 创建一个状态变量 show，用于控制子菜单的显示与隐藏
  const hasSubMenu = link?.subMenus?.length > 0 // 检查是否存在子菜单，如果存在，将 hasSubMenu 设置为 true

  // 如果 link 不存在或不应该显示（show 为 false），返回 null 不渲染组件
  if (!link || !link.show) {
    return null
  }

  return (
    // 包裹组件的根 div，控制鼠标移入和移出时的子菜单显示状态
    <div
      onMouseOver={() => changeShow(true)} // 鼠标移入时，显示子菜单
      onMouseOut={() => changeShow(false)}>

      {/* 当没有子菜单时，显示 Link 组件作为菜单项 */}
      {!hasSubMenu && (
        <Link
          href={link?.href} // 导航链接
          target={link?.target} // 设置打开方式（新标签或当前标签）
          className='select-none menu-link pl-2 pr-4 no-underline tracking-widest pb-1 hover:font-bold'> {/* 添加样式 */}
          {link?.icon && <i className={link?.icon} />} {/* 如果链接包含图标，则显示图标 */}
          {link?.name} {/* 显示菜单项名称 */}
        </Link>
      )}

      {/* 如果存在子菜单，则以 div 元素显示菜单项 */}
      {hasSubMenu && (
        <>
          <div className='cursor-pointer menu-link pl-2 pr-4 no-underline tracking-widest pb-1 hover:font-bold'> {/* 添加样式 */}
            {link?.icon && <i className={link?.icon} />} {/* 如果链接包含图标，则显示图标 */}
            {link?.name} {/* 显示菜单项名称 */}
          </div>
        </>
      )}

      {/* 子菜单部分 */}
      {hasSubMenu && (
        <ul
          className={`${show ? 'visible opacity-100 top-14' : 'invisible opacity-0 top-20'} transition-all duration-300 z-30 absolute block`}>
          {/* 显示或隐藏子菜单 */}
          {link.subMenus.map((sLink, index) => {
            return (
              // 遍历每个子菜单项并创建列表项 li
              <li
                key={index} // 使用 index 作为 key
                className='cursor-pointer text-start dark:text-white hover:font-semibold tracking-wider transition-all duration-200 py-0.5 pr-6 pl-3'>
                {/* 子菜单项的样式 */}
                <Link href={sLink.href} target={link?.target}> {/* 子菜单项的链接 */}
                  <span className='text-sm'>
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>} {/* 如果有图标，则显示图标 */}
                    {sLink.title} {/* 显示子菜单项的标题 */}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
