import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type FilterProps = {
  priceFrom: number | null;
  priceTo: number | null;
  size: string;
  sortBy: "" | "Price Ascending" | "Price Descending" | "Discount First";
  colors: string[];
  discount: boolean;
};

const sortByArray = ["Price Ascending", "Price Descending", "Discount First"];

function Filter({
  maxPrice,
  data,
  onFilter,
}: {
  maxPrice?: number;
  data: FilterProps;
  onFilter: (data: FilterProps) => void;
}) {
  const [formData, setFormData] = useState<FilterProps>(data);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const colors = [
    "black",
    "brown",
    "blue",
    "light-blue",
    "white",
    "beige",
    "green",
    "red",
    "gray",
    "yellow",
    "orange",
    "multicolored",
  ];

  // useEffect(() => {
  //   if (openFilter) {
  //     setFormData((prev) => ({
  //       ...prev
  //     }));
  //   }
  // }, [openFilter, maxPrice]);

  function handleReset() {
    setFormData({
      priceFrom: null,
      priceTo: maxPrice || null,
      size: "",
      sortBy: "",
      colors: [],
      discount: false,
    });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onFilter(formData);
    setOpenFilter(false);
  }

  const modal = openFilter
    ? createPortal(
        <dialog id="filter-modal" open>
          <form onSubmit={handleSubmit}>
            <div className="main-filter">
              <div className="header-filter">
                <h3>Filter</h3>
                <button onClick={() => setOpenFilter(false)}>x</button>
              </div>
              <label>Price</label>
              <div className="filter-price">
                <label htmlFor="from">From</label>
                <input
                  type="number"
                  name="from"
                  value={formData.priceFrom ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceFrom:
                        e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />

                <label htmlFor="to">To</label>
                <input
                  type="number"
                  name="to"
                  value={formData.priceTo ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceTo:
                        e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />
              </div>
              <label htmlFor="size">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, size: e.target.value }))
                }
              />
              <label>Color</label>
              <div className="filter-color">
                {colors.map((item) => (
                  <div key={item}>
                    <input
                      type="checkbox"
                      name={item}
                      checked={formData.colors.includes(item)}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          colors: e.target.checked
                            ? [...prev.colors, item]
                            : prev.colors.filter((color) => color !== item),
                        }));
                      }}
                    />
                    <label htmlFor={item}>{item}</label>
                  </div>
                ))}
              </div>
              <div className="filter-sort">
                {sortByArray.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`sort-option ${
                      formData.sortBy === item ? "selected-sort" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sortBy:
                          prev.sortBy === item
                            ? ""
                            : (item as
                                | ""
                                | "Price Ascending"
                                | "Price Descending"
                                | "Discount First"),
                      }))
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-button">
              <button type="button" onClick={handleReset}>
                Reset
              </button>
              <button type="submit">Filter</button>
            </div>
          </form>
        </dialog>,
        document.getElementById("modal")!
      )
    : null;
  return (
    <div className="filter">
      <button onClick={() => setOpenFilter(true)}>Filter</button>
      {modal}
    </div>
  );
}

export default Filter;
