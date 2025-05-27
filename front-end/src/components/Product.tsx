import { GenderProps } from "../pages/client/GenderPage";

export type ProductProps = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountpercentage: number;
  size: string;
  stock: number;
  brand: string;
  sku: string;
  images: string[];
  color: string;
  discountPrice?: number | null;
  gender: GenderProps | null;
};

const categoryWomen = [
  "jeans",
  "dresses",
  "skirts",
  "leggings",
  "hoodies",
  "sweatshirts",
  "t-shorts",
  "tops",
  "bodysuits",
  "sneakers",
  "trainers",
  "slippers",
  "sunglases",
  "socks",
  "belt",
];
const categoryMen = [
  "jeans",
  "pants",
  "hoodies",
  "sweatshirts",
  "t-shorts",
  "shirt",
  "sneakers",
  "trainers",
  "slippers",
  "sunglases",
  "socks",
  "belt",
];

export const calculateDiscountPrice = (
  price: number,
  discountPercentage: number
): number => {
  return price - (price * discountPercentage) / 100;
};
export default function Product({
  id,
  images,
  title,
  price,
  description,
  discountpercentage,
}: ProductProps) {
  let discountPrice = calculateDiscountPrice(price, discountpercentage);
  return (
    <article className="product">
      {discountpercentage > 0 && (
        <div className="product-procentage">
          -{Math.floor(discountpercentage)}%
        </div>
      )}
      <img src={images[0]} alt={title} />
      <div className="product-content">
        <div>
          <h3>{title}</h3>
          {discountpercentage > 0 ? (
            <p className="product-price">
              <span>{discountPrice}$</span> <s>{price}$</s>
            </p>
          ) : (
            <p className="product-price">{price}$</p>
          )}
          <p className="product-description">{description}</p>
        </div>
      </div>
    </article>
  );
}

export { categoryMen, categoryWomen };
