import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Scrollbar,
  Autoplay,
  Parallax,
  EffectCards,
} from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import styles from "@/styles/baslide.module.scss";
import { Card } from "@chakra-ui/react";

interface Product {
  id: number;
  name: string;
  info: string;
}

export default function SwiperTest() {
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  SwiperCore.use([Navigation, Scrollbar, Autoplay, Parallax, EffectCards]);
  const swiperRef = useRef<SwiperCore>();
  const fetchProductData = async () => {
    try {
      const response = await fetch("/api/products");
      const dataFromServer: Product[] = await response.json();
      console.log(dataFromServer);
      setProductData(dataFromServer);
    } catch (error) {
      console.error("데이터를 불러오는 도중 오류 발생:", error);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, []);

  const handleSlideClick = (index: number) => {
    // 슬라이드 클릭 시 선택된 상품 정보 갱신
    setSelectedProduct(productData[index]);
  };

  return (
    <div className={styles.title}>
      <p>어떤 원두가 있는지 확인해보세요 👇</p>
      <div className={styles.swipercontainer}>
        <Swiper
          onSwiper={(swiper) => {
            // swiperRef.current = swiper;
            setTimeout(() => {
              swiper.update();
            }, 1000);
          }}
          modules={[Navigation, Scrollbar, Parallax, EffectCards]}
          className={styles.swiperslider}
          effect={"cards"}
          cardsEffect={{
            perSlideOffset: 30,
            slideShadows: false,
            perSlideRotate: 10,
            rotate: true,
          }}
          spaceBetween={250} // 슬라이스 사이 간격
          slidesPerView={1} // 보여질 슬라이스 수
          // navigation={true} // prev, next button
          parallax
          observeParents
          observer={true}
          grabCursor={true}
          autoplay={{
            delay: 2500,
          }}
        >
          {productData.map((product, index) => {
            return (
              <SwiperSlide key={product.id} className={styles.card}>
                <div
                  className={styles.image}
                  onClick={() => handleSlideClick(index)}
                >
                  <Image
                    fill={true}
                    style={{ borderRadius: "10%" }}
                    src={`/productimage/image3 copy.png`}
                    alt={`Product ${index + 1}`}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {selectedProduct && (
          <div className={styles.selectedproductinfo}>
            <p>{selectedProduct.name}</p>
            <p>{selectedProduct.info}</p>
            {/* 기타 정보 표시 */}
          </div>
        )}
      </div>
    </div>
  );
}
