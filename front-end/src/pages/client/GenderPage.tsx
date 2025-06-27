import { useEffect, useRef, useState } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Filter, { FilterProps } from "../../components/Filter.tsx";
import { useAppDispatch } from "../../store/hooks.ts";
import { restore } from "../../store/user-slice.ts";

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
  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<ProductProps[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  /*const location = useLocation();*/
  const [filters, setFilters] = useState<FilterProps>({
    priceFrom: null,
    priceTo: maxPrice,
    size: [],
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
  const queryClient = useQueryClient();
  const isInitialFilterLoad = useRef(true);
  const [currentGender, setCurrentGender] = useState(gender);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [currentCategoryItem, setCurrentCategoryItem] = useState(categoryItem);

  useEffect(() => {
    const fetchMaxPrice = async () => {
      if (gender) {
        const price = await getPrice(gender, category, categoryItem);
        setMaxPrice(price);
        // setFilters((prev) => ({
        //   ...prev,
        //   priceTo: price,
        // }));
        if (isInitialFilterLoad.current) {
          setFilters((prev) => ({
            ...prev,
            priceTo: price,
          }));
          isInitialFilterLoad.current = false;
        }
        // setOffset(0);
        // setProducts([]);
        // setHasMore(true);
      }
    };
    //   if (gender && category) fetchMaxPrice();
    // }, [gender, category, categoryItem]);
    if (
      gender !== currentGender ||
      category !== currentCategory ||
      categoryItem !== currentCategoryItem
    ) {
      isInitialFilterLoad.current = true;
      setCurrentGender(gender);
      setCurrentCategory(category);
      setCurrentCategoryItem(categoryItem);
    }
    if (gender && category) fetchMaxPrice();
  }, [
    gender,
    category,
    categoryItem,
    currentGender,
    currentCategory,
    currentCategoryItem,
  ]);

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
      JSON.stringify(filters),
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
    // placeholderData: (previousData) => previousData ?? [],
  });

  useEffect(() => {
    setOffset(0);
    setProducts([]);
    setHasMore(true);
    console.log("also clear");

    // }, [ JSON.stringify(filters), queryClient]);
  }, [gender, category, categoryItem, JSON.stringify(filters)]);

  useEffect(() => {
    //       setOffset(0);
    // setProducts([]);
    setFilters({
      priceFrom: null,
      priceTo: maxPrice || null,
      size: [],
      sortBy: "",
      colors: [],
      discount: false,
    });
  }, [gender, category, categoryItem]);

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
      if (fetchedData.length < limitOfProducts) {
        setHasMore(false);
      }
    }
  }, [fetchedData]);

  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasMore) setOffset((prev) => prev + limitOfProducts);
  }, [inView]);

  useEffect(() => {
    console.log("up")
    dispatch(restore());
  }, []);

  if (isError)
    return (
      <div>
        {error?.name}: {error?.message}
      </div>
    );

  if (isLoading && !products.length) return <div>Pending...</div>;

  function handleFilter(data: FilterProps) {
    setOffset(0);
    setFilters(data);
    // setProducts([]);
    // setHasMore(true);
    console.log("clear");
  }
  return (
    <>
      <Header />

      <CategoryMenu gender={gender as "men" | "women"} />

      {category && (
        <div className="filter-conteiner">
          <h3>
            {categoryItem
              ? `FIND YOUR PERFECT ${categoryItem.toUpperCase()}`
              : `FIND YOUR PERFECT ${category.toUpperCase()}`}
          </h3>
          <Filter
            maxPrice={maxPrice}
            data={filters}
            category={category}
            onFilter={handleFilter}
          />
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
