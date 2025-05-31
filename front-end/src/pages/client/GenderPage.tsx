import { useEffect, useState } from "react";
import { getAllProducts, getPrice } from "../../services/shopService";
import Product, { ProductProps } from "../../components/Product";
import Header from "../../components/Header";
import { useLocation, useParams } from "react-router-dom";
import Shop from "../../components/Shop.tsx";
import CategoryMenu, {
  categoryAccessoriesMen,
  categoryAccessoriesWomen,
  categoryClothingMen,
  categoryClothingWomen,
  categoryShoesMen,
  categoryShoesWomen,
} from "../../components/CategoryMenu.tsx";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import Filter, { FilterProps } from "../../components/Filter.tsx";

export type GenderProps = "men" | "women";
export type CategoryProps = "clothing" | "shoes" | "accessories";

export type CategoryClothingMen =
  | "jeans"
  | "pants"
  | "hoodies"
  | "sweatshirts"
  | "t-shorts"
  | "shirt";
export type CategoryShoesMen = "sneakers" | "trainers" | "slippers";
export type CategoryAccessoriesMen = "sunglases" | "socks" | "belt";

export type CategoryClothingWomen =
  | "jeans"
  | "dresses"
  | "skirts"
  | "leggings"
  | "hoodies"
  | "sweatshirts"
  | "t-shorts"
  | "tops"
  | "bodysuits";
export type CategoryShoesWomen = "sneakers" | "trainers" | "slippers";
export type CategoryAccessoriesWomen = "sunglases" | "socks" | "belt";

export type CategoryItemProps =
  | CategoryClothingMen
  | CategoryShoesMen
  | CategoryAccessoriesMen
  | CategoryClothingWomen
  | CategoryShoesWomen
  | CategoryAccessoriesWomen;

function GenderPage() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  /*const location = useLocation();*/
  const [filters, setFilters] = useState<FilterProps>({
    priceFrom: null,
    priceTo: maxPrice,
    size: "",
    sortBy: "",
    colors: [],
    discount: false,
  });
  const { gender, category, categoryItem } = useParams<{
    gender?: GenderProps;
    category?: CategoryProps;
    categoryItem?: CategoryItemProps;
  }>();
  const limitOfProducts = 12;
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const fetchMaxPrice = async () => {
      if (gender) {
        const price = await getPrice(gender, category, categoryItem);
        setMaxPrice(price);
        setFilters((prev) => ({
          ...prev,
          priceTo: price,
        }));
      }
    };
    if (gender && category) fetchMaxPrice();
  }, [gender, category, categoryItem]);

  const isValidCategoryItem = (
    gender: GenderProps,
    category: CategoryProps,
    categoryItem: CategoryItemProps
  ) => {
    if (gender === "men") {
      if (category === "clothing") {
        return categoryClothingMen.includes(categoryItem);
      } else if (category === "shoes") {
        return categoryShoesMen.includes(categoryItem);
      } else if (category === "accessories") {
        return categoryAccessoriesMen.includes(categoryItem);
      }
    } else if (gender === "women") {
      if (category === "clothing") {
        return categoryClothingWomen.includes(categoryItem);
      } else if (category === "shoes") {
        return categoryShoesWomen.includes(categoryItem);
      } else if (category === "accessories") {
        return categoryAccessoriesWomen.includes(categoryItem);
      }
    }
    return false;
  };

  const {
    isLoading,
    isError,
    error,
    data: fetchedData,
  } = useQuery({
    queryKey: [
      "products",
      gender,
      offset,
      category || null,
      categoryItem || null,
      filters,
    ],
    queryFn: async () => {
      if (gender) {
        return await getAllProducts(
          gender,
          limitOfProducts,
          offset,
          category,
          categoryItem,
          filters
        );
      }
      return [];
    },
  });

  useEffect(() => {
    setProducts([]);
    setOffset(0);
  }, [gender, category, categoryItem, filters]);

  // useEffect(() => {
  //   setProducts([]);
  //   setOffset(0);
  // }, [location.key]);

  useEffect(() => {
    if (fetchedData) {
      // const update = fetchedData.map((data: ProductProps)=> {
      //   let discountPrice = null
      //   const discount = parseFloat(String(data.discountpercentage));
      //   if (discount !== 0.00){
      //     discountPrice = parseFloat(data.price)  - ((parseFloat(data.price) * discount) / 100)

      //   }
      //   else {
      //     discountPrice = parseFloat(data.price)
      //   }
      //   return {
      //     ...data,
      //     discountPrice

      //   };
      // });
      setProducts((prev) => [...prev, ...(fetchedData || [])]);
    }
  }, [fetchedData]);

  useEffect(() => {
    setFilters({
      priceFrom: null,
      priceTo: maxPrice || null,
      size: "",
      sortBy: "",
      colors: [],
      discount: false,
    });
  }, [gender, category, categoryItem]);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) setOffset((prev) => prev + limitOfProducts);
  }, [inView]);

  if (isError)
    return (
      <div>
        {error?.name}: {error?.message}
      </div>
    );

  if (isLoading && !products.length) return <div>Pending...</div>;

  function handleFilter(data: FilterProps) {
    setFilters(data);
    setOffset(0);
    setProducts([]);
  }
  return (
    <>
      <Header />

      <CategoryMenu gender={gender as "men" | "women"} />

      {category && (
        <div className="filter-conteiner">
          <h3>{categoryItem ? categoryItem : category}</h3>
          <Filter maxPrice={maxPrice} data={filters} onFilter={handleFilter} />
        </div>
      )}

      <Shop>
        {products.map((product: ProductProps, index) => (
          <li
            className="product-list"
            key={product.id}
            ref={index === products.length - 1 ? ref : null}
          >
            <Link to={`/product/${gender}/${product.id}`}>
              <Product {...product} images={product.images} />
            </Link>
          </li>
        ))}
      </Shop>
    </>
  );
}

export default GenderPage;
