import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, EffectCards } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import styles from "@/styles/subslide.module.scss";
import Link from "next/link";

interface DataItem {
  name: string;
  price: number;
  week: number;
  Subs_Index: number;
  imageUrl: string;
  sale_status: number;
}

export default function SubSwiper() {
  SwiperCore.use([Navigation, Scrollbar]);
  const swiperRef = useRef<SwiperCore>();
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출
        const response = await fetch("/api/data");
        const dataFromServer = await response.json();
        setData(dataFromServer);
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.title}>
      <h1>월정액 서비스</h1>
      <p>할인된 가격으로 월정액 서비스를 이용해보세요</p>
      <div className={styles.swipercontainer}>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Scrollbar]}
          className={styles.swiperslider}
          spaceBetween={0} // 슬라이스 사이 간격
          slidesPerView={4} // 보여질 슬라이스 수
          navigation={true} // prev, next button
          scrollbar={true}
        >
          {data.map((item, index) => {
            return (
              <SwiperSlide key={index} style={item.sale_status !== 1 ? { display: 'none' } : {}}>
              <div className={styles.card}>
                <Link href={`/subscription/${item.Subs_Index}`}>
                  <div className={styles.image}>
                    <Image
                      fill={true}
                      className={styles.image}
                      src={item.imageUrl}
                      alt={`${item.name}`}
                    />
                  </div>
                </Link>
              </div>
            </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
