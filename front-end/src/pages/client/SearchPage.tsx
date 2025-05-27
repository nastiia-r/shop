import { useEffect, useState } from "react";
import { SearchProps } from "../../components/Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Product, { ProductProps } from "../../components/Product";
import Filter, { FilterProps } from "../../components/Filter";
import { searchProducts } from "../../services/shopService";
import { useInView } from "react-intersection-observer";
import Shop from "../../components/Shop";
import Header from "../../components/Header";

export default function SearchPage() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const text = params.get("t") || "";
  const [searchDate, setSearchDate] = useState<SearchProps>({
    categorySearch: "all",
    textSearch: text,
  });
  const [find, setFind] = useState<boolean>(true);
  const navigate = useNavigate();
  const limitOfProducts = 12;
  const [offset, setOffset] = useState<number>(0);
  const [filters, setFilters] = useState<FilterProps>({
    priceFrom: null,
    priceTo: null,
    size: "",
    sortBy: "",
    colors: [],
    discount: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const text = params.get("t") || "";
    const category = params.get("c") || "all";
    setSearchDate((prev) => ({
      ...prev,
      textSearch: text,
      categorySearch: category as "women" | "all" | "men",
    }));
    const priceFrom = params.get("priceFrom");
    const priceTo = params.get("priceTo");
    const size = params.get("size") || "";
    const sortBy = params.get("sortBy") || "";
    const colors = params.getAll("colors") || [];
    const discount = params.get("discount") === "true";

    setFilters({
      priceFrom: priceFrom ? parseInt(priceFrom, 10) : null,
      priceTo: priceTo ? parseInt(priceTo, 10) : null,
      size,
      sortBy:
        (sortBy as
          | ""
          | "Price Ascending"
          | "Price Descending"
          | "Discount First") || "",
      colors,
      discount,
    });
  }, [location.search]);

  const {
    isLoading,
    isError,
    error,
    data: fetchedData,
  } = useQuery({
    queryKey: ["products", offset, find, filters, location],
    queryFn: async () => {
      return await searchProducts(
        limitOfProducts,
        offset,
        searchDate.textSearch,
        searchDate.categorySearch,
        filters
      );
    },
  });

  useEffect(() => {
    setProducts([]);
    setOffset(0);
  }, [location.key]);

  useEffect(() => {
    if (fetchedData && fetchedData.length) {
      setProducts((prev) => [...prev, ...fetchedData]);
    }
  }, [fetchedData]);

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

  // function handleFilter(data: FilterProps) {

  //     setFilters(data);
  //     setOffset(0);
  //     setProducts([]);
  // }
  function handleFilter(data: FilterProps) {
    setFilters(data);
    setOffset(0);
    setProducts([]);

    const searchParams = new URLSearchParams(location.search);

    if (data.discount !== undefined) {
      searchParams.set("discount", data.discount ? "true" : "");
    } else {
      searchParams.delete("discount");
    }
    if (data.priceFrom !== null && data.priceFrom !== undefined) {
      searchParams.set("priceFrom", data.priceFrom.toString());
    } else {
      searchParams.delete("priceFrom");
    }
    if (data.priceTo !== null && data.priceTo !== undefined) {
      searchParams.set("priceTo", data.priceTo.toString());
    } else {
      searchParams.delete("priceTo");
    }
    if (data.size) {
      searchParams.set("size", data.size);
    } else {
      searchParams.delete("size");
    }
    if (data.sortBy) {
      searchParams.set("sortBy", data.sortBy);
    } else {
      searchParams.delete("sortBy");
    }

    searchParams.delete("colors");
    if (data.colors && data.colors.length > 0) {
      data.colors.forEach((color) => {
        searchParams.append("colors", color);
      });
    }

    navigate(`/search?${searchParams.toString()}`);
    setFind(!find);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProducts([]);
    setOffset(0);
    const searchParams = new URLSearchParams(location.search);
    if (searchDate.textSearch) {
      searchParams.set("t", searchDate.textSearch);
    }
    if (searchDate.categorySearch !== "all") {
      searchParams.set("c", searchDate.categorySearch);
    }

    navigate(`/search?${searchParams.toString()}`);
    setFind(!find);
  }

  return (
    <>
      <Header hideSearch />
      <Link to={"/"} className="back-button">
        ← Back to {"homepage"}
      </Link>

      <form onSubmit={handleSubmit}>
        <select
          name="category"
          value={searchDate.categorySearch}
          onChange={(e) => {
            setSearchDate((prev) => ({
              ...prev,
              categorySearch: e.target.value as "all" | "men" | "women",
            }));
          }}
        >
          <option value="all">All</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
        </select>
        <input
          type="text"
          value={searchDate.textSearch}
          onChange={(e) =>
            setSearchDate((prev) => ({
              ...prev,
              textSearch: e.target.value.trim(),
            }))
          }
        />
        <button type="submit">Search</button>
      </form>
      <Filter data={filters} onFilter={handleFilter} />

      <Shop>
        {products.map((product: ProductProps, index) => (
          <li key={product.id} ref={index === products.length - 1 ? ref : null}>
            <Link to={`/product/${product.gender}/${product.id}`}>
              <Product {...product} images={product.images} />
            </Link>
          </li>
        ))}
      </Shop>
    </>
  );
}
