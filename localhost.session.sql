-- nanti tinggal blok lalu ctrl+e

use `belajar-database-prisma`;

-- disini kita buat dulu table sample
-- baru buat model schemanya

-- 1.
create table sample (
     id varchar(100) not null,
     nama varchar(100) not null,
     constraint primary_key_id primary key (id)
     )engine = innodb;


-- 2. membaut tabel customer (setelah buat model di prisma)
create table customer (
     id varchar(100) not null,
     nama VARCHAR(100) not null,
     email varchar(100) not null,
     phone varchar(100) not null,
     constraint primaryKeyId primary key (id),
     constraint emailUnique unique (email),
     constraint phoneUnique unique (phone)
)engine = innodb;

-- buat tabel products (lalu buat di schema)
CREATE table products (
     id int not null,
     nama varchar(100) not null,
     price int not null,
     stock int not null,
     category varchar(100) not null,
     constraint primary_key_id primary key(id)
)engine = innodb;
-- data insert products
INSERT INTO products (id, nama, price, stock, category) VALUES
(1, 'Nasi Goreng Spesial', 15000, 50, 'makanan'),
(2, 'Ayam Geprek', 18000, 40, 'makanan'),
(3, 'Soto Ayam', 17000, 35, 'makanan'),
(4, 'Bakso Urat', 16000, 45, 'makanan'),
(5, 'Mie Ayam', 14000, 50, 'makanan'),
(6, 'Sate Ayam', 20000, 30, 'makanan'),
(7, 'Rendang Daging', 25000, 20, 'makanan'),
(8, 'Gado-Gado', 12000, 25, 'makanan'),
(9, 'Tahu Tek', 10000, 40, 'makanan'),
(10, 'Lontong Sayur', 13000, 28, 'makanan'),

(11, 'Es Teh Manis', 5000, 100, 'minuman'),
(12, 'Kopi Hitam', 8000, 70, 'minuman'),
(13, 'Jus Alpukat', 12000, 40, 'minuman'),
(14, 'Susu Coklat Dingin', 10000, 50, 'minuman'),
(15, 'Teh Tarik', 9000, 60, 'minuman'),
(16, 'Es Jeruk', 6000, 90, 'minuman'),

(17, 'Tisu Makan', 2000, 150, 'lain lain'),
(18, 'Sendok Plastik', 500, 300, 'lain lain'),
(19, 'Kotak Makanan', 1500, 200, 'lain lain'),
(20, 'Sedotan', 300, 400, 'lain lain');




