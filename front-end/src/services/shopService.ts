import { FilterProps } from "../components/Filter";
import { ProductProps } from "../components/Product";
import { SearchProps } from "../components/Search";
import {
  CategoryItemProps,
  CategoryProps,
  GenderProps,
} from "../pages/client/GenderPage";

export async function getProduct(gender: GenderProps, id: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/product/${gender}/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPrice(
  gender: GenderProps,
  category?: CategoryProps,
  categoryItem?: CategoryItemProps
): Promise<number> {
  try {
    let url = `http://localhost:3000/api/price/${gender}`;
    if (category) url += `/${category}`;
    if (categoryItem) url += `/${categoryItem}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const result = await response.json();
    return result.length > 0 ? parseFloat(result[0].price) + 1 : 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function getAllProducts(
  gender: GenderProps,
  limit: number,
  offset: number,
  category?: CategoryProps,
  categoryItem?: CategoryItemProps,
  filters?: FilterProps
): Promise<ProductProps[]> {
  try {
    let url = `http://localhost:3000/api/${gender}`;
    if (category) url += `/${category}`;
    if (categoryItem) url += `/${categoryItem}`;
    url += `/?limit=${limit}&offset=${offset}`;

    if (filters) {
      if (filters.priceFrom) url += `&priceFrom=${filters.priceFrom}`;
      if (filters.priceTo) url += `&priceTo=${filters.priceTo}`;
      if (filters.size) url += `&size=${filters.size}`;
      if (filters.sortBy) {
        if (filters.sortBy === "Price Ascending") url += `&sortBy=1`;
        if (filters.sortBy === "Price Descending") url += `&sortBy=2`;
        if (filters.sortBy === "Discount First") url += `&sortBy=3`;
      }
      if (filters.colors && filters.colors.length > 0) {
        url += `&colors=${filters.colors.join(",")}`;
      }
      if (filters.discount) url += `&discount=${filters.discount}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function searchProducts(
  limit: number,
  offset: number,
  textSearch: string,
  genderSearch: "men" | "women" | "all",
  filters?: FilterProps
): Promise<ProductProps[]> {
  try {
    let url = `http://localhost:3000/api/search`;

    url += `?limit=${limit}&offset=${offset}`;
    url += `&t=${encodeURIComponent(textSearch)}`;
    url += `&c=${encodeURIComponent(genderSearch)}`;

    if (filters) {
      if (filters.priceFrom) url += `&priceFrom=${filters.priceFrom}`;
      if (filters.priceTo) url += `&priceTo=${filters.priceTo}`;
      if (filters.size) url += `&size=${filters.size}`;
      if (filters.sortBy) {
        if (filters.sortBy === "Price Ascending") url += `&sortBy=1`;
        if (filters.sortBy === "Price Descending") url += `&sortBy=2`;
        if (filters.sortBy === "Discount First") url += `&sortBy=3`;
      }
      if (filters.colors && filters.colors.length > 0) {
        url += `&colors=${filters.colors.join(",")}`;
      }
      if (filters.discount) url += `&discount=${filters.discount}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// export async function getAllProducts(gender: GenderProps, limit: number, offset: number): Promise<ProductProps[]> {
//   try {
//     const response = await fetch(`http://localhost:3000/api/${gender}/?limit=${limit}&offset=${offset}`);

//     if (!response.ok) {
//       throw new Error("Failed to fetch products");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch products:", error);
//     return [];
//   }
// }

// export async function getProductsByCategory(gender: GenderProps, limit: number, offset: number, category: CategoryProps): Promise<ProductProps[]> {
//   try {

//     const response = await fetch(`http://localhost:3000/api/${gender}/${category}/?limit=${limit}&offset=${offset}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch products");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch products:", error);
//     return [];
//   }
// }

// export async function getProductsByCategoryItem(gender: GenderProps, limit: number, offset: number, category: CategoryProps, categoryItem: CategoryItemProps): Promise<ProductProps[]> {
//   try {
//     const response = await fetch(`http://localhost:3000/api/${gender}/${category}/${categoryItem}/?limit=${limit}&offset=${offset}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch products");
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch products:", error);
//     return [];
//   }
// }

export async function addProduct(
  product: ProductProps,
  gender: "men" | "women"
) {
  try {
    const response = await fetch(`http://localhost:3000/api/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...product, gender }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
export async function loginClient(email: string, password: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
}

export async function registerClient(
  name: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch(`http://localhost:3000/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Register failed");
    }
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
}
