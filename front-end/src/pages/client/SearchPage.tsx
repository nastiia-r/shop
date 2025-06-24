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
import useWindowWidth from "../../store/windowWidth";

export default function SearchPage() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  let widthScrean = useWindowWidth();
  let isNotMobile = widthScrean >= 500;
  const lastLocation = useLocation();
  const from = lastLocation.state?.from || null;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const text = params.get("t") || "";
  const [searchDate, setSearchDate] = useState<SearchProps>({
    genderSearch: "all",
    textSearch: text,
  });
  const [find, setFind] = useState<boolean>(true);

  const navigate = useNavigate();
  const limitOfProducts = 12;
  const [offset, setOffset] = useState<number>(0);
  const [filters, setFilters] = useState<FilterProps>({
    priceFrom: null,
    priceTo: null,
    size: [],
    sortBy: "",
    colors: [],
    discount: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const text = params.get("t") || "";
    const gender = params.get("c") || "all";
    setSearchDate((prev) => ({
      ...prev,
      textSearch: text,
      genderSearch: gender as "women" | "all" | "men",
    }));
    const priceFrom = params.get("priceFrom");
    const priceTo = params.get("priceTo");
    const size = params.getAll("size") || [];
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
    queryKey: ["products", offset, find, filters, location.search],
    queryFn: async () => {
      return await searchProducts(
        limitOfProducts,
        offset,
        searchDate.textSearch,
        searchDate.genderSearch,
        filters
      );
    },
  });

  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
  }, [location.key]);

  useEffect(() => {
    if (fetchedData) {
      setProducts((prev) => [...prev, ...fetchedData]);
    }
  }, [fetchedData]);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasMore) setOffset((prev) => prev + limitOfProducts);
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
    setHasMore(true);
    const searchParams = new URLSearchParams(location.search);

    if (data.discount) {
      searchParams.set("discount", "true");
    } else {
      searchParams.delete("discount");
    }
    if (data.priceFrom) {
      searchParams.set("priceFrom", data.priceFrom.toString());
    } else {
      searchParams.delete("priceFrom");
    }
    if (data.priceTo) {
      searchParams.set("priceTo", data.priceTo.toString());
    } else {
      searchParams.delete("priceTo");
    }
    searchParams.delete("size");
    if (data.size) {
      if (data.size && data.size.length > 0) {
        data.size.forEach((size) => {
          searchParams.append("size", size);
        });
      }
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
    setHasMore(true);
    const searchParams = new URLSearchParams(location.search);
    if (searchDate.textSearch) {
      searchParams.set("t", searchDate.textSearch);
    }
    if (searchDate.genderSearch !== "all") {
      searchParams.set("c", searchDate.genderSearch);
    }
    navigate(`/search?${searchParams.toString()}`, {
      state: { from: location.state?.from || location.pathname },
    });
    setFind(!find);
  }

  return (
    <>
      <Header hideSearch />
      <Link to={from ? from : "/"} className="back-button">
        ← Back to {"homepage"}
      </Link>

      <form className="search-page-form" onSubmit={handleSubmit}>
        <select
          name="category"
          value={searchDate.genderSearch}
          onChange={(e) => {
            setSearchDate((prev) => ({
              ...prev,
              genderSearch: e.target.value as "all" | "men" | "women",
            }));
          }}
        >
          <option value="all">All</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
        </select>
        <input
          type="text"
          className="input-search-header"
          value={searchDate.textSearch}
          onChange={(e) =>
            setSearchDate((prev) => ({
              ...prev,
              textSearch: e.target.value.trim(),
            }))
          }
        />
        <button type="submit" className="button-search-header">
          {isNotMobile ? (
            <p>Search</p>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-search-heart"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018" />
              <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11" />
            </svg>
          )}
        </button>
      </form>
      <div className="filter-conteiner">
        <h3>FIND YOUR PERFECT</h3>
        <Filter data={filters} category="all" onFilter={handleFilter} />
      </div>
      <Shop>
        {products.map((product: ProductProps, index) => (
          <li
            className="product-list"
            key={product.id}
            ref={index === products.length - 1 ? ref : null}
          >
            <Link to={`/product/${product.gender}/${product.id}`}>
              <Product {...product} images={product.images} />
            </Link>
          </li>
        ))}
      </Shop>
    </>
  );
}
