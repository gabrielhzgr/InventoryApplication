#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `

CREATE TABLE IF NOT EXISTS demographics (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  gender VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tags(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS models(
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  description VARCHAR(255) NOT NULL UNIQUE,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  demo_id INTEGER NOT NULL REFERENCES demographics(id)
);

CREATE TABLE IF NOT EXISTS shoes(
  sku INTEGER GENERATED ALWAYS AS IDENTITY,
  color VARCHAR(25) NOT NULL,
  size VARCHAR(25) NOT NULL, 
  price NUMERIC(10,2) NOT NULL,
  model_id INTEGER NOT NULL references models(id),
  units_in_stock INTEGER NOT NULL,
  PRIMARY KEY (color, size, price, model_id)
);

CREATE TABLE IF NOT EXISTS models_tags(
  model_id INTEGER NOT NULL references models(id),
  tag_id INTEGER NOT NULL references tags(id),
  PRIMARY KEY (model_id, tag_id)
);

INSERT INTO brands (name) 
VALUES
  ('Nike'),
  ('Adidas'),
  ('Charly'),
  ('Puma');

INSERT INTO demographics (gender) 
VALUES 
  ('unisex kid'), 
  ('unisex adult'), 
  ('girl'), 
  ('boy'),
  ('man'),
  ('woman');

INSERT INTO tags (name) VALUES 
  ('sport'),
  ('casual'),
  ('basketball'),
  ('soccer'),
  ('football'),
  ('formal'),
  ('beach'),
  ('sandals'),
  ('motorsport'),
  ('streetwear');

INSERT INTO models (description, brand_id, demo_id) VALUES
  ('Puma unisex ferrari man',4,2),
  ('Nike woman sandals',1,6),
  ('Adidas 2000 man',2,5);

INSERT INTO shoes (color, size, price, model_id, units_in_stock)
VALUES 
('Beige', '6.5M', 50.00, 1, 3),
('Beige', '7.5M', 52.00, 1, 3),
('Blue', '7M', 50.0, 3, 1),
('White', '7W', 60.00, 2, 10),
('Pink', '7W', 65.00, 2, 6),
('Green', '8M', 70.00, 3, 5),
('Brown', '8M', 70.00, 3, 3);

INSERT INTO models_tags VALUES 
(1,1),
(1,2),
(1,9),
(2,2),
(2,7),
(2,8),
(3,2),
(3,10);
`

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.argv[2],
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
