import { ArrowPath, ChevronLeft, ChevronRight } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { compressImage } from '@/lib/notion/mapImage'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import { usePlogGlobal } from '..'

/**
 * 弹出框
 */
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
    if (index <= 0) {
      setModalContent(posts[posts.length - 1])
    } else {
      setModalContent(posts[index - 1])
    }
  }

  const next = () => {
    if (!posts?.length || !modalContent) return
    setLoading(true)
    const index = posts.findIndex(post => post.slug === modalContent.slug)
    if (index === posts.length - 1) {
      setModalContent(posts[0])
    } else {
      setModalContent(posts[index + 1])
    }
  }

  // 键盘支持：←/→ 切换，Esc 关闭（JS 版本：去掉 TS 类型）
  useEffect(() => {
    if (!showModal) return
    if (typeof window === 'undefined') return

    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showModal, modalContent, posts])

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-20'
        initialFocus={cancelButtonRef}
        onClose={handleClose}
      >
        {/* 遮罩 */}
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className='fixed inset-0 glassmorphism transition-opacity'
          />
        </Transition.Child>

        <div className='fixed inset-0 z-30 overflow-y-auto'>
          <div className='flex min-h-full justify-center p-4 text-center items-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 scale-50 w-0'
              enterTo={'opacity-100 translate-y-0 max-w-screen'}
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 scale-100  max-w-screen'
              leaveTo='opacity-0 translate-y-4 scale-50 w-0'
            >
               <Dialog.Panel className='group relative transform rounded-none text-left shadow-xl transition-all'>
                {/* 右下角加载动画 */}
                <div className={`absolute right-0 bottom-0 m-4 ${loading ? '' : 'hidden'}`}>
                  <ArrowPath className='w-10 h-10 animate-spin text-gray-200' />
                </div>

                {/* 图片区域 */}
                <div className='overflow-hidden'>
                  <Link href={modalContent?.href ?? '#'} aria-label='Open detail page'>
                    <LazyImage
                      onLoad={handleImageLoad}
                      placeholderSrc={thumbnail}
                      src={bigImage}
                      ref={imgRef}
                      className='w-full select-none max-w-7xl max-h-[90vh] shadow-xl animate__animated animate__fadeIn'
                    />
                  </Link>
                </div>

                {/* 左箭头 */}
                <button
                  onClick={prev}
                  className='fixed left-0 top-1/2 -translate-y-1/2 px-2 md:px-4
                             opacity-60 hover:opacity-100 focus:opacity-100 transition-opacity
                             cursor-pointer select-none'
                  aria-label='Previous'
                >
                  <ChevronLeft className='w-16 h-24 md:w-24 md:h-32 stroke-white stroke-1 scale-y-150' />
                </button>

                {/* 右箭头 */}
                <button
                  onClick={next}
                  className='fixed right-0 top-1/2 -translate-y-1/2 px-2 md:px-4
                             opacity-60 hover:opacity-100 focus:opacity-100 transition-opacity
                             cursor-pointer select-none'
                  aria-label='Next'
                >
                  <ChevronRight className='w-16 h-24 md:w-24 md:h-32 stroke-white stroke-1 scale-y-150' />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
