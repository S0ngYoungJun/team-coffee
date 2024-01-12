"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import styles from "@/styles/adminorder.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";
import ImageUploadp
 from "@/components/test/ImageUploadp";
interface ProductInfo {
  product_id: string;
  product_name: string;
  stock_quantity: number;
  timestamp: string;
  imageurl: string;
  display_status: number;
  info: string;
}

const pageSize = 10; // 페이지당 표시할 항목 수

export default function Product() : React.ReactNode {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState<string | null>(
    null
  );
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [imageurl, setImageurl] = useState<string | null>(null);

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  const resetForm = () => {
    setProductInfo({
      product_id: "",
      product_name: "",
      stock_quantity: 0,
      timestamp: "",
      imageurl: "",
      display_status: 0,
      info: "",
    });
  };


  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [pageInfo.currentPage]);

  const fetchData = async (page: number) => {
    try {
      const response = await fetch(
        `/api/admin/product?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      setProducts(data.products);

      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const [productInfo, setProductInfo] = useState<ProductInfo>({
    product_id: "",
    product_name: "",
    stock_quantity: 0,
    timestamp: "",
    imageurl: "",
    display_status: 0,
    info: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedProductInfo = {
        ...productInfo,
        imageUrl: imageurl, // 이미지 URL 추가
      };


      const response = await fetch("/api/admin/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProductInfo),
      });

      if (response.ok) {
        fetchData(pageInfo.currentPage);
        alert("등록 완료");
        resetForm()
      setShowForm(false); // 폼 닫기
      } else {
        // 오류 응답 처리
        console.error(`Error adding subscription: ${response.status}`);
        alert("등록 실패");
      }

      // 입력 폼 초기화
      setProductInfo({
        product_id: "",
        product_name: "",
        stock_quantity: 0,
        timestamp: "",
        imageurl: "",
        display_status: 0,
        info: ""
      });
      setShowForm(false); // 폼 닫기
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error adding subscription:", error);
    }
  };

  const handleDelete = async (product_id: string) => {
    try {
      const response = await fetch(`/api/admin/product/${product_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Product deleted successfully");
        fetchData(pageInfo.currentPage);
        alert("삭제 완료");
      } else {
        console.error(`Error deleting Product: ${response.status}`);
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("Error deleting Product:", error);
    }
  };

  const handleAdd = () => {
    setShowEditForm(false); // 수정 폼 숨기기
    setShowForm(true); // 추가 폼 표시
    resetForm();
  };

  const handleCorrection = (product_id: string) => {
    setShowForm(false); // 추가 폼 숨기기
    setEditingProductIndex(product_id);
    const editingProduct = products.find((product) => product.product_id === product_id);
    if (editingProduct) {
      setProductInfo(editingProduct);
      setShowEditForm(true); // 수정 폼 표시
    }
  };

  const handleUpdate = async (product_id: string) => {
    try {
      const response = await fetch(`/api/admin/product/${product_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productInfo),
      });

      if (response.ok) {
        alert("수정 완료");
        fetchData(pageInfo.currentPage);
        setEditingProductIndex(null);
        setShowEditForm(false); // 폼 닫기
        resetForm();
      } else {
        // 오류 응답 처리
        console.error(`Error updating product: ${response.status}`);
        alert("수정 실패");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const formatdate = (date: string) => {
    const dateDate = new Date(date);
    const dateLocalString = dateDate.toLocaleDateString();
    return dateLocalString;
  };


  const handleImageUpload = (imageUrl: string) => {
    // 이미지 업로드 성공 시, 이미지 URL을 state에 업데이트
    setImageurl(imageUrl);
    console.log("이미지 업로드 성공:", imageUrl);
  };

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>상품 관리</h1>
        <button
          onClick={handleAdd}
          className={styles.addButton}
        >
          추가
        </button>
        {showForm && (
          <div className={styles.addSubscription}>
            <label className={styles.addLabel}>
              <div>
                <ImageUploadp onImageUpload={handleImageUpload} />
              </div>
             </label>
            <label className={styles.addLabel}>
              <div>
                <ImageUploadp onImageUpload={handleImageUpload} />
              </div>
             </label>
            <label className={styles.addLabel}>
              상품명:
              <input
                type="text"
                name="product_name"
                value={productInfo.product_name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              재고:
              <input
                type="text"
                name="stock_quantity"
                value={productInfo.stock_quantity}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              이미지:
              <input
                type="text"
                name="imageurl"
                value={productInfo.imageurl}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            전시여부:
            <select
              type="text"
              name="display_status"
              value={productInfo.display_status}
              onChange={handleChange}
              className={styles.addInput}
            >
              <option value={1}>전시</option>
              <option value={0}>미전시</option>
            </select>
            <label className={styles.addLabel}>
              상세정보:
              <input
                type="text"
                name="info"
                value={productInfo.info}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <button onClick={handleSubmit} className={styles.delButton}>
              등록
            </button>
          </div>
        )}
        {showEditForm && (
          <div className={styles.addSubscription}>
            <label className={styles.addLabel}>
              상품명:
              <input
                type="text"
                name="product_name"
                value={productInfo.product_name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              재고:
              <input
                type="text"
                name="stock_quantity"
                value={productInfo.stock_quantity}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              이미지:
              <input
                type="text"
                name="imageUrl"
                value={productInfo.imageurl}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              전시여부:
              <select
                name="display_status"
                value={productInfo.display_status}
                onChange={handleChange}
                className={styles.addInput}
              >
                <option value={1}>전시</option>
                <option value={0}>미전시</option>
              </select>
            </label>
            <label className={styles.addLabel}>
              상세정보:
              <input
                type="text"
                name="info"
                value={productInfo.info}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <button
              onClick={() => handleUpdate(productInfo.product_id)}
              className={styles.delButton}
            >
              수정
            </button>
          </div>
        )}
        <div className={styles.orderContent}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>상품번호</th>
                <th>상품명</th>
                <th>재고</th>
                <th>이미지</th>
                <th>전시여부</th>
                <th>상세설명</th>
                <th>등록일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.product_id}
                  className={`${styles.correction} ${
                    editingProductIndex === product.product_id && showEditForm
                      ? styles.editingRow
                      : ""
                  }`}
                >
                  <td>{product.product_id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.stock_quantity}</td>
                  <td>{product.imageurl}</td>
                  <td>{product.display_status === 1 ? "전시" : "미전시"}</td>
                  <td className={styles.truncate} >{product.info}</td>
                  <td>{formatdate(product.timestamp)}</td>

                  <td>
                    <button
                      className={styles.delButton}
                      onClick={() => handleCorrection(product.product_id)}
                    >
                      수정
                    </button>
                    <button
                      className={styles.delButton}
                      onClick={() => handleDelete(product.product_id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            {Array.from(
              { length: pageInfo.totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`${styles.paginationButton} ${
                  pageNumber === pageInfo.currentPage ? styles.active : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
