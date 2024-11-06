import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { usePhotoGlobal } from '..'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 网站顶部
 * @returns {JSX.Element} - 页头组件
 */
export const Header = props => {
  const { collapseRef } = usePhotoGlobal() // 移除 searchModal
  const router = useRouter()
  const { customNav, customMenu } = props
  const { locale } = useGlobal()
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenuOpen = () => {
    setIsOpen(!isOpen)
  }

  // 默认导航链接设置，移除搜索项
  let links = [
    {
      id: 1,
      icon: 'fa-solid fa-house',
      name: locale.NAV.INDEX, // 首页导航项
      href: '/',
      show: siteConfig('MOVIE_MENU_INDEX', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE, // 归档导航项
      href: '/archive',
      show: siteConfig('MOVIE_MENU_ARCHIVE', null, CONFIG)
    }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  // 重置链接的ID以确保唯一性
  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i
    }
  }

  // 如果启用自定义菜单，则覆盖Page生成的默认菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  return (
    <>
      {/* 页头容器 */}
      <header className='w-full px-8 h-20 z-20 flex lg:flex-row md:flex-col justify-between items-center'>
        {/* 左侧Logo */}
        <Link
          href='/'
          className='logo whitespace-nowrap text-2xl md:text-3xl font-bold text-gray-dark no-underline flex items-center'>
          {siteConfig('TITLE')} {/* 显示站点标题 */}
        </Link>

        {/* 右侧菜单 */}
        <div className='md:w-auto text-center flex space-x-2'>
          {/* 右侧菜单项 */}
          <>
            <nav
              id='nav-mobile'
              className='leading-8 justify-center w-full hidden md:flex'>
              {/* 显示每个菜单链接 */}
              {links?.map(
                (link, index) =>
                  link && link.show && <MenuItemDrop key={index} link={link} /> // 条件渲染菜单项
              )}
            </nav>

            {/* 移动端按钮 */}
            <div className='md:hidden'>
              <div onClick={toggleMenuOpen} className='w-8 cursor-pointer'>
                {isOpen ? (
                  <i className='fas fa-times' />
                ) : (
                  <i className='fas fa-bars' />
                )}
              </div>
            </div>
          </>
        </div>
      </header>

      {/* 移动端菜单折叠内容 */}
      <Collapse
        className='block md:hidden'
        collapseRef={collapseRef}
        type='vertical'
        isOpen={isOpen}>
        <menu id='nav-menu-mobile' className='my-auto justify-start'>
          {/* 显示每个菜单链接 */}
          {links?.map(
            (link, index) =>
              link &&
              link.show && (
                <MenuItemCollapse
                  onHeightChange={param =>
                    collapseRef.current?.updateCollapseHeight(param) // 更新折叠高度
                  }
                  key={index}
                  link={link}
                />
              )
          )}
        </menu>
      </Collapse>
    </>
  )
}
