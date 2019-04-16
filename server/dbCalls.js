const { Pool } = require('pg');

const pool = new Pool({
  user: 'adeline',
  host: 'localhost',
  database: 'ecommerce',
  password: 'adeline',
  port: 3211,
});

const tables = [
  ['users', 'id SERIAL, name TEXT, password TEXT'],
  [
    'adresses',
    'id SERIAL, number INTEGER, street TEXT, town TEXT, postalCode INTEGER, userId INTEGER',
  ],
  [
    'products',
    'id SERIAL, title TEXT, description TEXT, price FLOAT, image TEXT',
  ],
  ['orders', 'id SERIAL, date DATE, totalHT FLOAT, userId INTEGER'],
  ['orders_products', 'order_id INTEGER, product_id INTEGER'],
];

const dropTables = async () =>
  await Promise.all(
    tables.map(async table => {
      try {
        await pool.query(`DROP TABLE ${table[0]}`);
      } catch (e) {
        console.error(e);
      }
    })
  );

const createTables = async () =>
  await Promise.all(
    tables.map(async table => {
      try {
        await pool.query(`CREATE TABLE ${table[0]} (${table[1]})`);
      } catch (e) {
        console.error(e);
      }
    })
  );

const usersDatas = [
  ['Pauline', 'pwd456'],
  ['Axelle', 'pwd789'],
  ['Jonathan', 'pwd000'],
  ['Adeline', 'pwd123'],
];

const insertUser = async () =>
  await Promise.all(
    usersDatas.map(async userDatas => {
      try {
        await pool.query(
          'INSERT INTO users (name, password) VALUES($1, $2)',
          userDatas
        );
      } catch (e) {
        console.error(e);
      }
    })
  );

const adressesDatas = [
  [3, 'rue Jean Jaures', 'Paris', 75001, 1],
  [10, 'avenue Victor Hugo', 'Paris', 75011, 2],
  [32, 'rue Voltaire', 'Paris', 75005, 3],
  [5, 'boulevard Beaumarchais', 'Paris', 75013, 4],
];

const insertAdress = async () =>
  await Promise.all(
    adressesDatas.map(async adressDatas => {
      try {
        await pool.query(
          'INSERT INTO adresses (number, street, town, postalCode, userId) VALUES($1, $2, $3, $4, $5)',
          adressDatas
        );
      } catch (e) {
        console.error(e);
      }
    })
  );

const productsDatas = [
  ['Tshirt', 'Tshirt noir', 19.9, 'img/tshirt.jpg'],
  ['Pull', 'Pull bleu', 35, 'img/pull.jpg'],
  ['Jean', 'Jean brut', 60, 'img/jean.jpg'],
  ['Chaussettes', 'Chaussettes grises', 10.5, 'img/chaussettes.jpg'],
];

const insertProduct = async () =>
  await Promise.all(
    productsDatas.map(async productDatas => {
      try {
        await pool.query(
          'INSERT INTO products (title, description, price, image) VALUES($1, $2, $3, $4)',
          productDatas
        );
      } catch (e) {
        console.error(e);
      }
    })
  );

const ordersDatas = [
  ['01/10/2019', 95, 1],
  ['02/15/2019', 10.5, 2],
  ['02/16/2019', 54.9, 3],
  ['03/05/2019', 35, 4],
];

const insertOrder = async () =>
  await Promise.all(
    ordersDatas.map(async orderDatas => {
      try {
        await pool.query(
          'INSERT INTO orders (date, totalHT, userId) VALUES($1, $2, $3)',
          orderDatas
        );
      } catch (e) {
        console.error(e);
      }
    })
  );

const ordersProductsDatas = [[1, 2], [1, 3], [2, 4], [3, 1], [3, 2], [4, 2]];

const insertOrderProduct = async () =>
  await Promise.all(
    ordersProductsDatas.map(async orderProductDatas => {
      try {
        await pool.query(
          'INSERT INTO orders_products (order_id, product_id) VALUES($1, $2)',
          orderProductDatas
        );
      } catch (e) {
        console.error(e);
      }
    })
  );

const initDB = async () => {
  await dropTables();
  await createTables();
  await insertUser();
  await insertAdress();
  await insertProduct();
  await insertOrder();
  await insertOrderProduct();
};

initDB();

const selectByUserId = async (table, id) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${table} WHERE userid = ${id}`
  );
  return rows;
};

const selectAllTable = async table => {
  const { rows } = await pool.query(`SELECT * FROM ${table} ORDER BY id`);
  return rows;
};

const selectById = async (table, id) => {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = ${id}`);
  return rows[0];
};

const selectProductsByOrderId = async id => {
  const { rows } = await pool.query(
    `SELECT p.* FROM products p, orders_products op WHERE p.id = op.product_id AND op.order_id = ${id}`
  );
  return rows;
};

const addUser = async (name, password) => {
  await pool.query(
    `INSERT INTO users (name, password) VALUES ('${name}', '${password}') RETURNING *`
  );
};

const createUserAddress = async (
  name,
  password,
  number,
  street,
  town,
  postalcode
) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO users(name, password) VALUES('${name}', '${password}') RETURNING id`
    );
    await client.query(
      `INSERT INTO adresses(number, street, town, postalCode, userId) VALUES(${number}, '${street}', '${town}', ${postalcode}, ${
        rows[0].id
      })`
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const createOrder = async (userId, products) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: totalht } = await client.query(
      `SELECT SUM(price) FROM products WHERE id IN (${products})`
    );
    const { rows: orderId } = await client.query(
      `INSERT INTO orders (date, totalHT, userId) VALUES('04/16/2019', ${
        totalht[0].sum
      }, ${userId}) RETURNING id`
    );

    products.map(
      async product =>
        await client.query(
          `INSERT INTO orders_products (order_id, product_id) VALUES(${
            orderId[0].id
          }, ${product})`
        )
    );

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = {
  selectAllTable,
  selectById,
  selectByUserId,
  selectProductsByOrderId,
  addUser,
  createUserAddress,
  createOrder,
};
