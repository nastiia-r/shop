import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type FilterProps = {
  priceFrom: number | null;
  priceTo: number | null;
  size: string[];
  sortBy: "" | "Price Ascending" | "Price Descending" | "Discount First";
  colors: string[];
  discount: boolean;
};

const sortByArray = ["Price Ascending", "Price Descending", "Discount First"];

function Filter({
  maxPrice,
  data,
  category,
  onFilter,
}: {
  maxPrice?: number;
  data: FilterProps;
  category: "clothing" | "shoes" | "accessories" | "all";
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
  const sizeOfCategory: {
    clothing: string[];
    shoes: string[];
    accessories: string[];
    all: string[];
  } = {
    clothing: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    shoes: [
      "37",
      "37.5",
      "38",
      "38.5",
      "39",
      "39.5",
      "40",
      "40.5",
      "41",
      "41.5",
      "42",
      "42.5",
      "43",
      "43.5",
      "39-41",
      "41-43",
    ],
    accessories: ["One Size"],
    all: [],
  };
  sizeOfCategory.all = [
    ...sizeOfCategory.clothing,
    ...sizeOfCategory.shoes,
    ...sizeOfCategory.accessories,
  ];

  // useEffect(() => {
  //   if (openFilter) {
  //     setFormData((prev) => ({
  //       ...prev
  //     }));
  //   }
  // }, [openFilter, maxPrice]);

  function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const resetState: FilterProps = {
      priceFrom: null,
      priceTo: maxPrice || null,
      size: [],
      sortBy: "",
      colors: [],
      discount: false,
    };
    console.log(formData);
    setFormData(resetState);
    onFilter(resetState);
    setOpenFilter(false);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onFilter(formData);
    setOpenFilter(false);
    console.log(formData);
  }

  const modal = openFilter
    ? createPortal(
        <>
          <div className="cart-backdrop" />
          <dialog id="filter-modal" open>
            <form onSubmit={handleSubmit}>
              <div className="main-filter">
                <div className="header-filter">
                  <h3>Filter</h3>
                  <button onClick={() => setOpenFilter(false)}>x</button>
                </div>
                <p className="mt-4 p-2">Price:</p>
                <div className="filter-price">
                  <div className="price-from">
                    <label htmlFor="from">From:</label>

                    <input
                      type="number"
                      id="from"
                      name="from"
                      value={formData.priceFrom ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priceFrom:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="price-to">
                    <label htmlFor="to">To:</label>
                    <input
                      type="number"
                      name="to"
                      id="to"
                      value={formData.priceTo ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priceTo:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="section over-hide z-bigger">
                  <p className="mt-4 p-2">Size:</p>

                  <div className="filter-size col-12 pb-5">
                    {sizeOfCategory[category].map((item) => (
                      <div key={item} className="div-for-checkbox">
                        <input
                          type="checkbox"
                          className="checkbox-tools"
                          name={item}
                          id={item}
                          checked={formData.size.includes(item)}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              size: e.target.checked
                                ? [...prev.size, item]
                                : prev.size.filter((size) => size !== item),
                            }));
                          }}
                        />
                        <label className="for-checkbox-tools" htmlFor={item}>
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section over-hide z-bigger">
                  <p className="mt-4 p-2">Color:</p>

                  <div className="filter-color col-12 pb-5">
                    {colors.map((item) => (
                      <div key={item} className="div-for-checkbox">
                        <input
                          type="checkbox"
                          className="checkbox-tools"
                          name={item}
                          id={item}
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
                        <label className="for-checkbox-tools" htmlFor={item}>
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 p-2">Sort by</p>
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
              </div>
            </form>
          </dialog>
        </>,
        document.getElementById("modal")!
      )
    : null;
  return (
    <div className="filter">
      <button
        onClick={() => {
          setOpenFilter(true);
          console.log(formData);
        }}
      >
        Filter
      </button>
      {modal}
    </div>
  );
}

export default Filter;
