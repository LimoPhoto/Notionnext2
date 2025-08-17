// ✅ 删掉原来这句：import { ArrowPath, ChevronLeft, ChevronRight } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { compressImage } from '@/lib/notion/mapImage'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import { usePlogGlobal } from '..'

/** ===== 极简图标（内联 SVG，无需依赖） ===== */
const IconChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M15 5L8 12l7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconChevronRight = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconSpinner = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    {/* 背景环（淡） */}
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>
    {/* 前景弧（用 animate-spin 旋转） */}
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeDasharray="56 90" strokeDashoffset="0"/>
  </svg>
)

/**
 * 弹出框
 */
export default function Modal(props) {
  const { showModal, setShowModal, modalContent, setModalContent } = usePlogGlobal()
  const { siteInfo, posts } = props
  const cancelButtonRef = useRef(null) // 作为初始聚焦（去掉图片蓝白边）
  const thumbnail = modalContent?.pageCoverThumbnail || siteInfo?.pageCoverThumbnail
  const bigImage = compressImage(
    modalContent?.pageCover || siteInfo?.pageCover,
    1200,
    85,
    'webp'
  )
  const imgRef = useRef(null)
  const [loading, setLoading] = useState(true)

  function handleImageLoad() {
    setLoading(false)
  }

  function handleClose() {
    setShowModal(false)
    setLoading(true)
  }

  function prev() {
    if (!posts?.length || !modalContent) return
    setLoading(true)
    const index = posts.findIndex(post => post.slug === modalContent.slug)
    setModalContent(index <= 0 ? posts[posts.length - 1] : posts[index - 1])
  }

  function next() {
    if (!posts?.length || !modalContent) return
    setLoading(true)
    const index = posts.findIndex(post => post.slug === modalContent.slug)
    setModalContent(index === posts.length - 1 ? posts[0] : posts[index + 1])
  }

  // 键盘：←/→ 切换，Esc 关闭
  useEffect(() => {
    if (!showModal || typeof window === 'undefined') return
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      else if (e.key === 'Escape') { e.preventDefault(); handleClose() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showModal, modalContent, posts])

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        initialFocus={cancelButtonRef}
        onClose={handleClose}
      >
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-150'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              {/* Panel 全屏，所有交互在内部 */}
              <Dialog.Panel className='fixed inset-0 outline-none'>
                {/* 半透明背景，点击关闭 */}
                <div
                  className='absolute inset-0 bg-black/50'
                  onClick={handleClose}
                />

                {/* 内容层 */}
                <div className='relative z-10 flex h-full w-full items-center justify-center p-4'>

                  {/* 左上角关闭（把初始焦点放在这里，避免图片出现蓝白边） */}
                  <button
                    ref={cancelButtonRef}
                    type='button'
                    aria-label='Close'
                    className='absolute left-4 top-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition'
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClose() }}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                  >
                    {/* 极简 X（细线） */}
                    <svg viewBox='0 0 24 24' className='w-5 h-5' aria-hidden='true'>
                      <path d='M6 6l12 12M18 6L6 18' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
                    </svg>
                  </button>

                  {/* 图片 */}
                  {modalContent?.href ? (
                    <Link
                      href={modalContent.href}
                      aria-label='Open detail page'
                      className='focus:outline-none focus:ring-0 focus-visible:outline-2 focus-visible:outline-white/60'
                    >
                      <LazyImage
                        onLoad={handleImageLoad}
                        placeholderSrc={thumbnail}
                        src={bigImage}
                        ref={imgRef}
                        className='w-auto h-auto max-w-7xl max-h-[90vh] select-none shadow-xl animate__animated animate__fadeIn'
                      />
                    </Link>
                  ) : (
                    <LazyImage
                      onLoad={handleImageLoad}
                      placeholderSrc={thumbnail}
                      src={bigImage}
                      ref={imgRef}
                      className='w-auto h-auto max-w-7xl max-h-[90vh] select-none shadow-xl animate__animated animate__fadeIn'
                    />
                  )}

                  {/* 右下角加载（极简 spinner） */}
                  <div className={`absolute right-4 bottom-4 ${loading ? '' : 'hidden'}`}>
                    <IconSpinner className='w-6 h-6 text-white/80 animate-spin' />
                  </div>

                  {/* 左箭头（极简） */}
                  <button
                    type='button'
                    aria-label='Previous'
                    className='absolute left-0 top-1/2 -translate-y-1/2 px-2 md:px-4
                               opacity-80 hover:opacity-100 focus:opacity-100 transition-opacity
                               cursor-pointer select-none text-white'
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); prev() }}
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                  >
                    <IconChevronLeft className='w-12 h-12 md:w-14 md:h-14' />
                  </button>

                  {/* 右箭头（极简） */}
                  <button
                    type='button'
                    aria-label='Next'
                    className='absolute right-0 top-1/2 -translate-y-1/2 px-2 md:px-4
                               opacity-80 hover:opacity-100 focus:opacity-100 transition-opacity
                               cursor-pointer select-none text-white'
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); next() }}
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                  >
                    <IconChevronRight className='w-12 h-12 md:w-14 md:h-14' />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
