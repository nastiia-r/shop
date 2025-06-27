CREATE TABLE women(
	ID int,
	title varchar(225) NOT NULL,
	description varchar(225) NOT NULL,
	category varchar(225) NOT NULL,
	price money NOT NULL,
	discountPercentage int NOT NULL,
	size varchar(255) NOT NULL,
	stock int NOT NULL,
	brand varchar(225) NOT NULL,
	sku varchar(225) NOT NULL,
	images varchar(255) NOT NULL,
	color varchar(255)
);

CREATE TABLE men(
	ID int,
	title varchar(225) NOT NULL,
	description varchar(225) NOT NULL,
	category varchar(225) NOT NULL,
	price money NOT NULL,
	discountPercentage int NOT NULL,
	size varchar(255) NOT NULL,
	stock int NOT NULL,
	brand varchar(225) NOT NULL,
	sku varchar(225) NOT NULL,
	images varchar(255) NOT NULL,
	color varchar(255)
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'client' 
);

CREATE TABLE likes (
    customer_id INT REFERENCES customers(id),
    product_id INT REFERENCES products(id),
    PRIMARY KEY (customer_id, product_id)
);

CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    product_id INT REFERENCES men(id) women(id),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INT,
    total_price DECIMAL(10, 2)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    price DECIMAL(10, 2),
    discountpercentage DECIMAL(5, 2),
    size VARCHAR(255),
    stock INT,
    brand VARCHAR(255),
    sku VARCHAR(255) UNIQUE,
    images TEXT[],  
    color VARCHAR(255),
    gender VARCHAR(10) CHECK (gender IN ('men', 'women'))
);