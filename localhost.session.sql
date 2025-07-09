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
