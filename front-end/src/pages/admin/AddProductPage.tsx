import { categoryMen, categoryWomen } from "../../components/Product";
import { addProduct } from "../../services/shopService";
import { ProductProps } from "../../components/Product";
import { useState } from "react";

function AddProductPage() {
  const [gender, setGender] = useState<"men" | "women" | null>(null);
  const [sizeForm, setSizeForm] = useState<
    { size: string; stock: number; color: string }[]
  >([]);
  const [formData, setFormData] = useState<ProductProps>({
    id: 0,
    title: "",
    description: "",
    category: "",
    price: 0,
    discountpercentage: 0,
    size: "",
    stock: 0,
    brand: "",
    sku: "",
    images: [""],
    color: "",
    gender: null,
  });

  function handleAddSize() {
    if (!formData.size || !formData.stock) return;
    setSizeForm((prev) => [
      ...prev,
      {
        size: formData.size.toUpperCase(),
        stock: formData.stock,
        color: formData.color.trim(),
      },
    ]);
    setFormData((prev) => ({ ...prev, size: "", stock: 0, color: "" }));
  }

  function handleDelete(idSize: number) {
    setSizeForm((prev) => prev.filter((_, id) => id !== idSize));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gender) return;

    // const cheackData = {
    //     ...formData,
    //     title: formData.title.replace(/'/g, "''"),
    //     description: formData.description.replace(/'/g, "''"),
    //     brand: formData.brand.replace(/'/g, "''"),
    //     images: formData.images.replace(/'/g, "''"),
    //   };
    // const cheackData = {
    //     ...formData,
    //     title: formData.title.includes("'") ? formData.title.replace(/'/g, "''") : formData.title,
    //     description: formData.description.includes("'") ? formData.description.replace(/'/g, "''") : formData.description,
    //     brand: formData.brand.includes("'") ? formData.brand.replace(/'/g, "''") : formData.brand,
    //     images: formData.images.includes("'") ? formData.images.replace(/'/g, "''") : formData.images,
    // };

    let colorsItem = formData.color.split(",").map((item) => item.trim());
    colorsItem.forEach((item) => colorsItem.push(item));

    const products =
      // colorsItem.flatMap(oneColor =>
      sizeForm.map((sizeItem) => ({
        ...formData,
        size: sizeItem.size,
        stock: sizeItem.stock,
        sku: `${formData.sku}-${sizeItem.size.toUpperCase()}`,
        color: sizeItem.color,
        //color: oneColor
      }));
    //);

    products.forEach((product) => addProduct(product, gender));

    setFormData({
      id: 0,
      title: "",
      description: "",
      category: "",
      price: 0,
      discountpercentage: 0,
      size: "",
      stock: 0,
      brand: "",
      sku: "",
      images: [""],
      color: "",
      gender: null,
    });
    setSizeForm([]);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <button onClick={() => setGender("men")}>Men</button>
      <button onClick={() => setGender("women")}>Women</button>

      {gender && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <label>Category</label>
          {gender &&
            (gender === "men" ? categoryMen : categoryWomen).map((category) => (
              <label key={category}>
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={formData.category === category}
                  onChange={handleInputChange}
                />
                {category}
              </label>
            ))}

          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />

          <label htmlFor="discount">Discount</label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountpercentage}
            onChange={handleInputChange}
          />

          <label>Size</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
          />

          <label htmlFor="stock">On stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
          />

          <label htmlFor="color">Colors</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
          />

          <button type="button" onClick={handleAddSize}>
            Add size
          </button>

          <div className="size-list">
            <ul>
              {sizeForm.map((item, id) => (
                <li key={id}>
                  <p>
                    Size: {item.size} - Count: {item.stock} (Color: {item.color}
                    )
                  </p>
                  <button type="button" onClick={() => handleDelete(id)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          />

          <label htmlFor="sku">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
          />

          <label htmlFor="url-img">URL Images</label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleInputChange}
          />

          <button type="submit">Add</button>
        </form>
      )}
    </>
  );
}

export default AddProductPage;
