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


-- 2 membaut tabel customer (setelah buat model di prisma)
create table customer (
     id varchar(100) not null,
     nama VARCHAR(100) not null,
     email varchar(100) not null,
     phone varchar(100) not null,
     constraint primaryKeyId primary key (id),
     constraint emailUnique unique (email),
     constraint phoneUnique unique (phone)
)engine = innodb;