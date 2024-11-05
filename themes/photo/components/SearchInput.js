import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useImperativeHandle, useRef, useState } from 'react'

let lock = false

const SearchInput = ({ currentTag, keyword, cRef }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const searchInputRef = useRef(null)

  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      router.push({ pathname: '/search/' + key }).then(r => {
        console.log('搜索', key)
      })
    } else {
      router.push({ pathname: '/' }).then(r => {})
    }
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) { // 回车
      handleSearch(searchInputRef.current.value)
    } else if (e.keyCode === 27) { // ESC
      cleanSearch()
    }
  }

  const cleanSearch = () => {
    searchInputRef.current.value = ''
    setShowClean(false)
  }

  function lockSearchInput () {
    lock = true
  }

  function unLockSearchInput () {
    lock = false
  }

  const [showClean, setShowClean] = useState(false)

  const updateSearchKey = (val) => {
    if (lock) {
      return
    }
    searchInputRef.current.value = val
    setShowClean(!!val)
  }

  // 隐藏搜索框
  return null
}

export default SearchInput
