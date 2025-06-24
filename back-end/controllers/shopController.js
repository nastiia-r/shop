import { pool } from "../server.js";
import bcrypt from "bcrypt";

const validCategories = {
  men: {
    clothing: ["jeans", "pants", "hoodies", "sweatshirts", "t-shorts", "shirt"],
    shoes: ["sneakers", "trainers", "slippers"],
    accessories: ["sunglases", "socks", "belt"],
  },
  women: {
    clothing: [
      "jeans",
      "dresses",
      "skirts",
      "leggings",
      "hoodies",
      "sweatshirts",
      "t-shorts",
      "tops",
      "bodysuits",
    ],
    shoes: ["sneakers", "trainers", "slippers"],
    accessories: ["sunglases", "socks", "belt"],
  },
};

const getProduct = async (req, res) => {
  try {
    let gender = req.params.gender;
    let id = req.params.id;

    const result = await pool.query(
      `SELECT * FROM products WHERE SPLIT_PART(sku, '-', 1) = (SELECT SPLIT_PART(sku, '-', 1) FROM products WHERE id = $1)`,
      [id]
    );
    //const result = await pool.query(`SELECT * FROM products WHERE SPLIT_PART(sku, '-', 1) = ( SELECT SPLIT_PART(sku, '-', 1) FROM products WHERE id = $1) AND gender = (SELECT gender FROM products WHERE id = $1)`)
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(
      result.rows.map((row) => ({
        ...row,
        images: row.images,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let { gender, category, categoryItem } = req.params;
    let { limit, offset, priceFrom, priceTo, size, sortBy, colors, discount } =
      req.query;

    if (!validCategories[gender]) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    let query = `SELECT * FROM ( SELECT DISTINCT ON (SPLIT_PART(sku, '-', 1)) * FROM products`;
    let queryParams = [];
    let conditions = [];

    if (category && !categoryItem) {
      if (!validCategories[gender][category]) {
        return res.status(400).json({ message: "Invalid category" });
      }
      let categoryItems = validCategories[gender][category]
        .map((item) => `category = '${item}'`)
        .join(" OR ");
      conditions.push(`(${categoryItems})`);
    }

    if (categoryItem) {
      if (
        !validCategories[gender][category] ||
        !validCategories[gender][category].includes(categoryItem)
      ) {
        return res.status(400).json({ message: "Invalid category item" });
      }
      conditions.push(`category = $${queryParams.length + 1}`);
      queryParams.push(categoryItem);
    }

    if (priceFrom) {
      conditions.push(`price >= $${queryParams.length + 1}`);
      queryParams.push(priceFrom);
    }

    if (priceTo) {
      conditions.push(
        ` price - (discountpercentage * price / 100) <= $${
          queryParams.length + 1
        }`
      );
      queryParams.push(priceTo);
    }

    if (size) {
      let sizeArray = size.split(",");
      let sizeConditions = sizeArray
        .map((_, i) => `size = $${queryParams.length + i + 1}`)
        .join(" OR ");
      conditions.push(`(${sizeConditions})`);
      queryParams.push(...sizeArray);

    }

    if (colors) {
      let colorArray = colors.split(",");
      let colorConditions = colorArray
        .map((_, i) => `color = $${queryParams.length + i + 1}`)
        .join(" OR ");
      conditions.push(`(${colorConditions})`);
      queryParams.push(...colorArray);
    }

    if (discount) {
      conditions.push(`discountpercentage > 0`);
    }

    conditions.push(`gender = '${gender}'`);

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }
    query += ` ) AS unique_products`;
    if (sortBy) {
      if (sortBy === "1") {
        query += ` ORDER BY price ASC`;
      } else if (sortBy === "2") {
        query += ` ORDER BY price DESC`;
      } else if (sortBy === "3") {
        query += ` ORDER BY discountpercentage DESC`;
      }
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;
    queryParams.push(limit, offset);
    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSearchProducts = async (req, res) => {
  try {
    let {
      limit,
      offset,
      t,
      c,
      priceFrom,
      priceTo,
      size,
      sortBy,
      colors,
      discount,
    } = req.query;

    let query = `SELECT * FROM ( SELECT DISTINCT ON (SPLIT_PART(sku, '-', 1)) * FROM products`;
    let queryParams = [];
    let conditions = [];

    if (t) {
      conditions.push(
        `(title ILIKE $${queryParams.length + 1} OR category ILIKE $${
          queryParams.length + 1
        } OR description ILIKE $${queryParams.length + 1} OR sku ILIKE $${
          queryParams.length + 1
        })`
      );
      queryParams.push(`%${t}%`);
    }

    if (c && c !== "all") {
      conditions.push(`gender = $${queryParams.length + 1}`);
      queryParams.push(c);
    }

    if (priceFrom) {
      conditions.push(`price >= $${queryParams.length + 1}`);
      queryParams.push(priceFrom);
    }

    if (priceTo) {
      conditions.push(
        ` price - (discountpercentage * price / 100) <= $${
          queryParams.length + 1
        }`
      );
      queryParams.push(priceTo);
    }

    if (size) {
      let sizeArray = size.split(",");
      let sizeConditions = sizeArray
        .map((_, i) => `size = $${queryParams.length + i + 1}`)
        .join(" OR ");
      conditions.push(`(${sizeConditions})`);
      queryParams.push(...sizeArray);

    }

    if (colors) {
      let colorArray = colors.split(",");
      let colorConditions = colorArray
        .map((_, i) => `color = $${queryParams.length + i + 1}`)
        .join(" OR ");
      conditions.push(`(${colorConditions})`);
      queryParams.push(...colorArray);
    }

    if (discount) {
      conditions.push(`discountpercentage > 0`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }
    query += ` ) AS unique_products`;
    if (sortBy) {
      if (sortBy === "1") {
        query += ` ORDER BY price ASC`;
      } else if (sortBy === "2") {
        query += ` ORDER BY price DESC`;
      } else if (sortBy === "3") {
        query += ` ORDER BY discountpercentage DESC`;
      }
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;
    queryParams.push(limit, offset);
    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const findPrice = async (req, res) => {
  try {
    let { gender, category, categoryItem } = req.params;
    if (!validCategories[gender]) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    let query = `SELECT price FROM ( SELECT DISTINCT ON (SPLIT_PART(sku, '-', 1)) * FROM products`;

    if (category && !categoryItem) {
      if (!validCategories[gender][category]) {
        return res.status(400).json({ message: "Invalid category" });
      }
      let categoryItems = validCategories[gender][category]
        .map((item) => `category = '${item}'`)
        .join(" OR ");
      query += ` WHERE (${categoryItems})`;
    }

    if (categoryItem) {
      if (
        !validCategories[gender][category] ||
        !validCategories[gender][category].includes(categoryItem)
      ) {
        return res.status(400).json({ message: "Invalid category item" });
      }

      query += ` WHERE category = '${categoryItem}'`;
    }

    query += `AND gender = '${gender}' ) AS unique_products ORDER BY price DESC LIMIT 1`;
    const result = await pool.query(query);
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      category,
      price,
      discountPercentage,
      size,
      stock,
      brand,
      sku,
      images,
      color,
      gender,
    } = req.body;

    //const currentID = await pool.query(`SELECT MAX(id) AS max_id FROM ${gender}`);
    //const idData = parseInt(currentID.rows[0]?.max_id || 0) + 1;

    const result = await pool.query(
      `
      INSERT INTO products (title, description, category, price, discountPercentage, size, stock, brand, sku, images, color, gender)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id
    `,
      [
        title,
        description,
        category,
        price,
        discountPercentage,
        size,
        stock,
        brand,
        sku,
        images,
        color,
        gender,
      ]
    );
    // await pool.query(`
    //   SELECT setval(pg_get_serial_sequence($1, $2), $3, true)
    // `, [gender, 'id', idData]);
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await pool.query(
      `SELECT * FROM customers WHERE email = $1`,
      [email]
    );
    if (existingUser.rows.length === 0) {
      return res.status(400).json({ message: "Email not registered" });
    }
    const checkPassword = await bcrypt.compare(
      password,
      existingUser.rows[0].password
    );

    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await pool.query(
      `SELECT * FROM customers WHERE email = $1`,
      [email]
    );
    if (existingUser.rows.length > 0) {
      res.status(400).json({ message: "Email already registered" });
    }
    const result = await pool.query(
      `INSERT INTO customers(name, email, password)
    VALUES ($1, $2, $3) RETURNING id;`,
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Customers added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllProducts,
  addProduct,
  getProduct,
  findPrice,
  loginClient,
  registerClient,
  getSearchProducts,
};
