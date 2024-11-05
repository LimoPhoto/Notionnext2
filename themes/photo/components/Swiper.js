import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import PostItemCard from './PostItemCard';
import { Navigation } from 'swiper';

// 导入样式和导航模块
import 'swiper/css';
import 'swiper/css/navigation';

const SwiperComponent = ({ posts }) => {
  return (
    <div className='w-full mx-auto px-12 my-8'>
      {/* 使用 Swiper 组件 */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={10} // 每张图片之间的间距
        slidesPerView={1} // 每次只显示一张图片
        navigation // 启用左右导航按钮
        centeredSlides={true} // 图片居中显示
        grabCursor={true} // 鼠标变为抓手，提示可拖拽
        loop={true} // 允许无限循环滚动
      >
        {/* 显示每个滑块 */}
        {posts.map((post, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <PostItemCard post={post} /> {/* 渲染每个卡片 */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
