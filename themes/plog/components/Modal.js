import { ArrowPath, ChevronLeft, ChevronRight } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { compressImage } from '@/lib/notion/mapImage'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import { usePlogGlobal } from '..'

export default function Modal(props) {
  const { showModal, setShowModal, modalContent, setModalContent } = usePlogGlobal()
  const { siteInfo, posts } = props
  const cancelButtonRef = useRef(null)
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

  // 键盘支持：←/→ 切换，Esc 关闭
  useEffect(() => {
    if (!showModal) return
    if (typeof window === 'undefined') return
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
        {/* 不用外部遮罩，这里把遮罩放进 Panel 里，避免“外部点击”误判 */}
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
              {/* Panel 全屏，所有交互都在里面进行 */}
              <Dialog.Panel className='fixed inset-0 outline-none'>
                {/* 半透明背景，点击关闭 */}
                <div
                  className='absolute inset-0 bg-black/50'
                  onClick={handleClose}
                />

                {/* 内容层：居中摆放图片 */}
                <div className='relative z-10 flex h-full w-full items-center justify-center p-4'>
                  {modalContent?.href ? (
                    <Link href={modalContent.href} aria-label='Open detail page'>
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

                  {/* 右下角加载动画 */}
                  <div className={`absolute right-4 bottom-4 ${loading ? '' : 'hidden'}`}>
                    <ArrowPath className='w-10 h-10 animate-spin text-gray-200' />
                  </div>

                  {/* 左上角关闭按钮 */}
                  <button
                    type='button'
                    aria-label='Close'
                    className='absolute left-4 top-4 z-20 p-2 rounded-full
                               bg-black/40 text-white
                                hover:bg-black/60 focus:outline-none
                               focus:ring-2 focus:ring-white/60 transition'
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClose() }}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                    >
                    {/* 内联一个“X”图标，避免新增依赖/导入 */}
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'
                                 fill='none' stroke='currentColor' strokeWidth='2'
                               className='w-6 h-6'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 6l12 12M18 6L6 18' />
                    </svg>
                    </button>

                  {/* 左箭头（固定页面左侧） */}
                  <button
                    type='button'
                    aria-label='Previous'
                    className='absolute left-0 top-1/2 -translate-y-1/2 px-2 md:px-4
                               opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity
                               cursor-pointer select-none'
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); prev() }}
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                  >
                    <ChevronLeft className='w-16 h-24 md:w-24 md:h-32 stroke-white stroke-1 scale-y-150' />
                  </button>

                  {/* 右箭头（固定页面右侧） */}
                  <button
                    type='button'
                    aria-label='Next'
                    className='absolute right-0 top-1/2 -translate-y-1/2 px-2 md:px-4
                               opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity
                               cursor-pointer select-none'
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); next() }}
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                  >
                    <ChevronRight className='w-16 h-24 md:w-24 md:h-32 stroke-white stroke-1 scale-y-150' />
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
