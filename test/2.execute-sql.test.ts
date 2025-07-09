import prismaClient from "../src/prisma";

it("testing", async () => {
  // jadi di prisma itu kita juga bsia emlakukan manual script
  // untuk si databasenya
  // jadi ga pake fungis bawaan dari si prismanya
  // tapi pake perintah manual
  // prisma-raw-query-example.ts
  // jadi untuk yang queryRaw itu untuk select data, dan mereturn promise
  //   data data yang di select
  // tapi kalo executeRaw itu untuk mengubah data
  // dan mereturn promise<number> jumlah angka berapada banyak data yang terkena impactnya
  // contoh

  const id = 1;
  const nama = "Rafa Khadafi";
  // disini kita buat yg executeRaw dulu -> promise<number>

  const impact =
    await prismaClient.$executeRaw`insert into sample (id, nama) values (${id}, ${nama});`;
  console.log(impact); // 1
  // yang terkena impack hanya 1 kolom

  // jadi pertama itu dia log
  // prisma:query insert into sample (id, nama) values (?, ?);
  // karena kita suruh kalo ada query, maka di log di file src/prisma

  // sekarang kita coba yang select

  // const data = await prismaClient.$queryRaw`select * from sample;`;
  // console.log(data);
  // disini hasilnya itu ada 3 data yg masuk, karena tadi saya sudah exsekusi
  // file ini sebanyak 3 kali
  // maka nya kita insert 3 data ke tablenya
  // [
  //   { id: '1', nama: 'Rafa Khadafi' },
  //   { id: '1', nama: 'Rafa Khadafi' },
  //   { id: '1', nama: 'Rafa Khadafi' }
  // ]

  // MAKANNYA KALO MAU EXSEKUSI, KITA EXSEKUSI PER TESTNYA
});

it("insert banyak", async () => {
  const impact =
    await prismaClient.$executeRaw`insert into sample (id,nama) values (${2},${"Jamal"}),(${3},${"siti"})`;
  console.log(impact); // 2
});

it.only("select data ", async () => {
  interface TypeDatas {
    id: number;
    nama: string;
  }

  const datas: TypeDatas[] = await prismaClient.$queryRaw`select * from sample`;
  console.log(datas);
  // nah sekanag jadi hanya 1
  // jadi setiap kali mau eksekusi, itu kita pisahkan jadi
  // hanay test itu saja, jadi tes yang lain ga dieksekusi

  // [ { id: '1', nama: 'Rafa Khadafi' } ]

  // disini ktia select pake for

  for (const data of datas) {
      console.log(`data id: ${data.id}\ndata nama: ${data.nama}`)
  }
});

it("hapus data (dipake kalo butuh aja) ", async () => {
  const id = 1;
  const impact =
    await prismaClient.$executeRaw`delete from sample where id = '2';`;
  console.log(impact); // 3 data terhapus

  // nah jadi cara exsekusinya itu pake nama testnya
  // jadi nanti setiap kita mau run testnya
  // kita harus buat dia menjadi only, dan setiap kali sudah
  // exsekusi maka hilangkan lagi onlynya
});

it("penjelasan", () => {
  /*
   *
   * Prisma menyediakan 4 metode utama untuk menjalankan query SQL mentah (raw SQL):
   * - $queryRaw
   * - $executeRaw
   * - $queryRawUnsafe
   * - $executeRawUnsafe
   *
   * Masing-masing punya fungsi dan keamanan berbeda. Penjelasan lengkapnya:
   *
   * ----------------------------------------------------------------------------
   * 1. $queryRaw
   * ----------------------------------------------------------------------------
   * - Digunakan untuk menjalankan SELECT (atau query yang mengembalikan data/records).
   * - Aman dari SQL Injection karena menggunakan parameter binding (template literal).
   * - Hasil yang dikembalikan berupa array objek (records).
   *
   * Contoh:
   */
  //   async function safeSelectWithQueryRaw() {
  //     const minAge = 20;
  //     const users = await prisma.$queryRaw`
  //     SELECT id, name, age FROM User WHERE age > ${minAge}
  //   `;
  //     console.log("Result from $queryRaw (safe):", users);
  //   }
  /*
   * - Cara kerja: Prisma secara otomatis membungkus parameter `${minAge}`
   *   agar tidak dapat dieksekusi sebagai bagian dari SQL, melainkan sebagai nilai bind.
   * - Rekomendasi: ✅ Sangat direkomendasikan untuk semua query SELECT yang dinamis.
   */
  /*
   * ----------------------------------------------------------------------------
   * 2. $executeRaw
   * ----------------------------------------------------------------------------
   * - Digunakan untuk menjalankan query non-SELECT, seperti UPDATE, DELETE, INSERT.
   * - Mengembalikan jumlah baris yang terpengaruh (affected rows).
   * - Juga aman dari SQL Injection karena menggunakan template literal (binding).
   *
   * Contoh:
   */
  //   async function safeUpdateWithExecuteRaw() {
  //     const isActive = true;
  //     const affected = await prisma.$executeRaw`
  //     UPDATE User SET updatedAt = NOW() WHERE isActive = ${isActive}
  //   `;
  //     console.log("Rows updated using $executeRaw:", affected);
  //   }
  /*
   * - Rekomendasi: ✅ Direkomendasikan untuk operasi yang mengubah data
   *   (UPDATE, DELETE, INSERT), karena aman dan fleksibel.
   */
  /*
   * ----------------------------------------------------------------------------
   * 3. $queryRawUnsafe
   * ----------------------------------------------------------------------------
   * - Sama seperti $queryRaw, tapi TIDAK menggunakan parameter binding.
   * - Query ditulis dalam bentuk string biasa.
   * - ❌ Rentan terhadap SQL Injection jika menerima input dari user tanpa validasi.
   *
   * Contoh:
   */
  //   async function unsafeSelectWithQueryRawUnsafe() {
  //     const minAge = 20;
  //     const rawQuery = `SELECT id, name FROM User WHERE age > ${minAge}`;
  //     const result = await prisma.$queryRawUnsafe(rawQuery);
  //     console.log("Result from $queryRawUnsafe (UNSAFE):", result);
  //   }
  /*
   * - Bahaya: Jika rawQuery disusun dengan input user tanpa validasi/sanitasi,
   *   hacker bisa menyisipkan SQL berbahaya (contoh: OR 1=1).
   * - Rekomendasi: ⚠️ Hanya gunakan untuk query statis atau sudah pasti aman.
   */
  /*
   * ----------------------------------------------------------------------------
   * 4. $executeRawUnsafe
   * ----------------------------------------------------------------------------
   * - Sama seperti $executeRaw, tapi query ditulis sebagai string biasa.
   * - Mengembalikan jumlah baris yang terpengaruh.
   * - ❌ Tidak aman jika ada input user dalam string SQL.
   *
   * Contoh:
   */
  //   async function unsafeDeleteWithExecuteRawUnsafe() {
  //     const isActive = false;
  //     const deleteSQL = `DELETE FROM User WHERE isActive = ${isActive}`;
  //     const deletedCount = await prisma.$executeRawUnsafe(deleteSQL);
  //     console.log("Deleted using $executeRawUnsafe (UNSAFE):", deletedCount);
  //   }
  /*
   * - Rekomendasi: ⚠️ Hindari jika memungkinkan, kecuali dalam situasi internal,
   *   query statis, atau input sudah divalidasi sepenuhnya.
   */
  /*
   * ============================================================================
   * REKOMENDASI PENGGUNAAN
   * ============================================================================
   *
   * ✅ Gunakan $queryRaw          → Jika butuh ambil data (SELECT), dengan parameter aman
   * ✅ Gunakan $executeRaw        → Jika ingin mengubah data (UPDATE, DELETE, INSERT) dengan aman
   * ⚠️ Gunakan $queryRawUnsafe   → Hanya jika query sepenuhnya aman dan tidak pakai input user
   * ⚠️ Gunakan $executeRawUnsafe → Hanya jika query sepenuhnya aman dan tidak pakai input user
   *
   * Hindari penggunaan ".Unsafe" di production kecuali sangat diperlukan dan dijamin aman.
   *
   * ============================================================================
   * CONTOH PANGGILAN FUNGSI
   * ============================================================================
   *
   * Untuk menjalankan semua contoh:
   */
  //   async function main() {
  //     await safeSelectWithQueryRaw();
  //     await safeUpdateWithExecuteRaw();
  //     await unsafeSelectWithQueryRawUnsafe(); // ⚠️ Untuk demonstrasi
  //     await unsafeDeleteWithExecuteRawUnsafe(); // ⚠️ Untuk demonstrasi
  //   }
  //   main()
  //     .catch((e) => console.error(e))
  //     .finally(() => prisma.$disconnect());
});
