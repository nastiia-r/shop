import { useState } from "react";
import { categoryMen, categoryWomen } from "./Product";
import { Link } from "react-router-dom";

type CategoryProp = {
  id: number;
  name: string;
  categoryName: string[];
};

const categoryClothingMen = categoryMen.slice(0, 6);
const categoryShoesMen = categoryMen.slice(6, 9);
const categoryAccessoriesMen = categoryMen.slice(9);

const categoryClothingWomen = categoryWomen.slice(0, 9);
const categoryShoesWomen = categoryWomen.slice(9, 12);
const categoryAccessoriesWomen = categoryWomen.slice(12);

function CategoryMenu({ gender }: { gender: "men" | "women" }) {
  const [hover, setHover] = useState<number | null>(null);
  const categorys: CategoryProp[] =
    gender === "men"
      ? [
          { id: 1, name: "Clothing", categoryName: categoryClothingMen },
          { id: 2, name: "Shoes", categoryName: categoryShoesMen },
          { id: 3, name: "Accessories", categoryName: categoryAccessoriesMen },
        ]
      : [
          { id: 1, name: "Clothing", categoryName: categoryClothingWomen },
          { id: 2, name: "Shoes", categoryName: categoryShoesWomen },
          {
            id: 3,
            name: "Accessories",
            categoryName: categoryAccessoriesWomen,
          },
        ];
  return (
    <>
      <p className="gender-nav">
        <Link to="/women">Women</Link>
        <Link to="/men">Men</Link>
      </p>
      <ul className="category-nav">
        {categorys.map((item) => (
          <li
            key={item.id}
            onMouseEnter={() => setHover(item.id)}
            onMouseLeave={() => setHover(null)}
          >
            <Link to={`/${gender}/${item.name.toLowerCase()}`}>
              {item.name}
            </Link>
            {hover === item.id && (
              <ul className="category-item-nav">
                {item.categoryName.map((itemCategory, index) => (
                  <li key={index}>
                    <Link
                      to={`/${gender}/${item.name.toLowerCase()}/${itemCategory.toLowerCase()}`}
                    >
                      {itemCategory}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
export default CategoryMenu;
export {
  categoryClothingMen,
  categoryClothingWomen,
  categoryShoesMen,
  categoryShoesWomen,
  categoryAccessoriesMen,
  categoryAccessoriesWomen,
};
