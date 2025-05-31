import { useEffect, useState } from "react";
import { calculateDiscountPrice, ProductProps } from "../../components/Product";
import { getProduct } from "../../services/shopService";
import { GenderProps } from "./GenderPage";
import { Link, useParams } from "react-router-dom";
import { useCartDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cart-slice";
import Header from "../../components/Header";
import { WarningMessage } from "../../components/WarningMessage";

function ProductPage() {
  const [slideIndex, setSlideIndex] = useState<number>(1);
  const [product, setProduct] = useState<ProductProps[]>([]);
  const [currentSize, setCurrentSize] = useState<string>("");
  const { gender, id } = useParams<{ gender?: GenderProps; id?: string }>();
  const [warning, setWarning] = useState<{
    description: string;
    level: string;
  } | null>(null);

  const dispatch = useCartDispatch();
  useEffect(() => {
    const fetchProducts = async () => {
      if (gender && id) {
        const data = await getProduct(gender, id);
        setProduct(data);
      }
    };
    fetchProducts();
  }, [gender, id]);

  function handleAddToCart(
    title: string,
    price: number,
    size: string,
    discountpercentage: number
  ) {
    let currentProduct = product.find((item) => item.size === size);
    if (!size) {
      setWarning({ description: "Choose size", level: "height" });
      return;
    }
    if (!currentProduct) {
      setWarning({ description: "Out of stock", level: "medium" });
      return;
    }

    dispatch(
      addToCart({
        id: currentProduct.id,
        title,
        price,
        size,
        discountpercentage,
      })
    );
  }

  function plusSlides(i: number) {
    setSlideIndex((prev) => {
      let newIndex = prev + i;
      if (newIndex > product[0]?.images.length) newIndex = 1;
      if (newIndex < 1) newIndex = product[0]?.images.length;
      return newIndex;
    });
  }

  function currentSlide(i: number) {
    setSlideIndex(i);
  }

  useEffect(() => showSlides(slideIndex), [slideIndex]);

  function showSlides(i: number) {
    const slides = document.querySelectorAll(
      ".slides-img-product"
    ) as NodeListOf<HTMLElement>;
    const dots = document.querySelectorAll(".demo-img");
    if (slides[i - 1]) {
      slides.forEach((slide) => (slide.style.display = "none"));
      dots.forEach((dot) => dot.classList.remove("active"));
      slides[i - 1].style.display = "block";
      dots[i - 1].classList.add("active");
    }
  }

  function onChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentSize(event.target.value);
  }

  // useEffect(()=>{
  //     const timer = setTimeout(()=>{setWarning(null)}, 3000)
  //     return () => clearTimeout(timer);
  // }, [warning])
  const discountPrice = calculateDiscountPrice(
    product[0]?.price,
    product[0]?.discountpercentage
  );

  return (
    <>
      <Header />
      <p className="gender-nav">
        <Link to="/women">Women</Link>
        <Link to="/men">Men</Link>
      </p>
      <div className="conteiner-product">
        <div className="conteiner-img-product">
          {product[0]?.images.map((item, index) => (
            <div
              key={index}
              className={`slides-img-product ${index === 0 ? "active" : ""}`}
              style={{ display: index === 0 ? "block" : "none" }}
            >
              {product[0]?.images.length > 1 && (
                <a className="prev-img" onClick={() => plusSlides(-1)}>
                  &#10094;
                </a>
              )}
              <img src={item} alt={product[0].title} />
              {product[0]?.images.length > 1 && (
                <a className="next-img" onClick={() => plusSlides(1)}>
                  &#10095;
                </a>
              )}
            </div>
          ))}
          {product[0]?.images.length > 1 && (
            <div className="row-img">
              {product[0]?.images.map((item, index) => (
                <div className="column-img" key={index}>
                  <img
                    className={`demo-img ${index === 0 ? "active" : ""}`}
                    src={item}
                    alt={product[0].title}
                    onClick={() => currentSlide(index + 1)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="product-text">
          <div className="product-header">
            <h3>{product[0]?.title}</h3>
            {product[0]?.discountpercentage > 0 && (
              <div className="product-procentage">
                -{Math.floor(product[0]?.discountpercentage)}%
              </div>
            )}
          </div>

          <p className="product-sku">({product[0]?.sku.split("-")[0]})</p>

          <p className="product-description">{product[0]?.description}</p>
          {product[0]?.discountpercentage > 0 ? (
            <p className="product-price">
              <span> {discountPrice}$</span> <s>{product[0]?.price}$</s>
            </p>
          ) : (
            <p className="product-price">{product[0]?.price}$</p>
          )}
          <p className="product-size">Size:</p>

          <div className="section over-hide z-bigger">
            <div className="container pb-5">
              <div className="row justify-content-center pb-5">
                <ul className="col-12 pb-5 product-sizes-list">
                  {product.map((item) => (
                    <li key={item.id}>
                      <input
                        className="checkbox-tools"
                        type="radio"
                        onChange={onChangeValue}
                        name="size"
                        id={item.size}
                        value={item.size}
                        disabled={item.stock === 0}
                      />
                      <label
                        htmlFor={item.size}
                        className={`size-radio for-checkbox-tools ${
                          item.stock === 0 ? "out-of-stock" : ""
                        }`}
                      >
                        {item.size}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="product-actions">
            <button
              onClick={() =>
                handleAddToCart(
                  product[0].title,
                  product[0].price,
                  currentSize,
                  product[0].discountpercentage
                )
              }
            >
              Add to Cart
            </button>
          </p>

          {warning && (
            <WarningMessage
              description={warning.description}
              level={warning.level}
              onClose={() => setWarning(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ProductPage;
