import prismaClient from "../src/prisma";

describe("testing group by", () => {
  // perbedaan antara having dan juga where
  //   where : digunakan untuk menyaring data mentah sebelum pengelompokan (groupby)
  //           diterapkan di baris / individu
  //           di terapkan sebelu group by

  //   having: digunakan untuk menyaring hasil dari groupby berdasarkan
  //           nilai agregate, jdi nyaring lagi tapi pake data agregate
  //           ditrapkn pada data haisl groupby
  //           dilakukan setelah grupby

  it("testing gruop by", async () => {
    // jadi disni kita akan
    // 1. Data difilter dulu dengan syarat nama produk TIDAK diawali "S"
    // 2. Setelah difilter, data dikelompokkan berdasarkan "category"
    // 3. Untuk tiap grup, dilakukan agregasi (misalnya _sum atau _avg pada kolom "price")
    // 4. Setelah itu, hanya grup yang hasil agregasinya memenuhi syarat `having` yang diambil
    //    (contoh: hanya kategori yang sum/total harganya > 5000 yang akan muncul)

    const dataImpact = await prismaClient.product.groupBy({
      // https://chatgpt.com/c/6870b036-b928-8009-9420-2a930e538575
      by: ["category"],
      where: {
        nama: {
          not: {
            startsWith: "S",
          },
        },
      },
      _sum: {
        price: true,
      },
      having: {
        // berdasarkan hasil agregasi di groupby
        price: {
          _sum: {
            gt: 5000,
          },
        },
      },
    });

    console.log(dataImpact);

    // ini hasillnya
    // [
    //   { _sum: { price: 123000 }, category: "makanan" },
    //   { _sum: { price: 40000 }, category: "minuman" },
    // ];
  });

  it("soal 1", async () => {
    //     Soal:
    // Kelompokkan data berdasarkan category, lalu ambil
    // kategori yang memiliki rata-rata harga produk lebih dari 10.000.

    const dataImpact = await prismaClient.product.groupBy({
      by: ["category"],
      _avg: {
        price: true,
      },
      having: {
        price: {
          _avg: {
            gt: 10000,
          },
        },
      },
    });
    console.log(dataImpact); // benar
    // [ { _avg: { price: 16000 }, category: 'makanan' } ]
  });

  it("soal 2.", async () => {
    // Hitung total stock berdasarkan category, tidak termasuk produk
    // yang mengandung "Ayam", dan tampilkan kategori dengan total stock > 100.
    const dataImpact = await prismaClient.product.groupBy({
      by: ["category"],
      where: {
        nama: {
          not: {
            contains: "Ayam",
          },
        },
      },
      _sum: {
        stock: true,
      },
      having: {
        stock: {
          _sum: {
            gt: 100,
          },
        },
      },
    });

    console.log(dataImpact); // benar
    // [
    //   { _sum: { stock: 208 }, category: 'makanan' },
    //   { _sum: { stock: 410 }, category: 'minuman' },
    //   { _sum: { stock: 1050 }, category: 'lain lain' }
    // ]
  });

  it.only("test 3", async () => {
    // Group by berdasarkan category, lalu tampilkan hanya kategori
    // yang total harga (_sum.price) ≤ 20.000.
    const dataImpact = await prismaClient.product.groupBy({
      by: ["category"],
      _sum: {
        price: true,
      },
      having: {
        price: {
          _sum: {
            lte: 20000,
          },
        },
      },
    });
    console.log(dataImpact); // benar
    // [ { _sum: { price: 4300 }, category: 'lain lain' } ]
  });

  it("penjelasan", () => {
    // https://chatgpt.com/c/6870a67f-1394-8009-976d-d874b65a66dc
    // import { PrismaClient } from "@prisma/client";
    // const prisma = new PrismaClient();
    // async function main() {
    //   // Apa itu groupBy?
    //   // ----------------
    //   // groupBy() adalah fitur dari Prisma Client untuk melakukan agregasi dan pengelompokan data
    //   // berdasarkan satu atau lebih kolom (field). Misalnya mengelompokkan pengguna berdasarkan negara,
    //   // lalu menghitung jumlah profileViews di tiap negara.
    //   // Kenapa menggunakan groupBy?
    //   // ---------------------------
    //   // Karena ketika kita ingin menganalisis data dalam grup (misal per kota, per kategori),
    //   // dan menghitung total, rata-rata, minimum, maksimum, dsb dalam tiap grup,
    //   // maka groupBy adalah pilihan terbaik dibandingkan melakukan pemrosesan manual.
    //   // Cara kerja groupBy():
    //   // ---------------------
    //   // 1. Filter data terlebih dahulu dengan 'where' (opsional).
    //   // 2. Kelompokkan data berdasarkan field di 'by'.
    //   // 3. Lakukan agregasi seperti _sum, _avg, _count, _min, _max.
    //   // 4. Filter grup hasil akhir dengan 'having' (opsional).
    //   // 5. Urutkan grup dengan 'orderBy' (opsional), lalu bisa diambil sebagian dengan skip/take.
    //   // Contoh 1: Mengelompokkan users berdasarkan negara dan menjumlahkan profileViews
    //   const groupByCountry = await prisma.user.groupBy({
    //     by: ["country"],
    //     _sum: {
    //       profileViews: true,
    //     },
    //   });
    //   console.log("Group by Country, Sum profileViews:", groupByCountry);
    //   // Contoh 2: Filter data sebelum dikelompokkan menggunakan 'where'
    //   const filterBeforeGroup = await prisma.user.groupBy({
    //     by: ["country"],
    //     where: {
    //       email: {
    //         contains: "prisma.io",
    //       },
    //     },
    //     _sum: {
    //       profileViews: true,
    //     },
    //   });
    //   console.log("Filtered users with email prisma.io:", filterBeforeGroup);
    //   // Contoh 3: Filter hasil group menggunakan 'having'
    //   const havingFilter = await prisma.user.groupBy({
    //     by: ["country"],
    //     where: {
    //       email: {
    //         contains: "prisma.io",
    //       },
    //     },
    //     _avg: {
    //       profileViews: true,
    //     },
    //     having: {
    //       profileViews: {
    //         _avg: {
    //           gt: 100, // hanya tampilkan grup negara dengan rata-rata profileViews > 100
    //         },
    //       },
    //     },
    //   });
    //   console.log("Having filter (avg profileViews > 100):", havingFilter);
    //   // Contoh 4: Gunakan notIn di 'where' untuk menyaring negara
    //   const excludeCountries = await prisma.user.groupBy({
    //     by: ["country"],
    //     where: {
    //       country: {
    //         notIn: ["Sweden", "Ghana"],
    //       },
    //     },
    //     _sum: {
    //       profileViews: true,
    //     },
    //     having: {
    //       profileViews: {
    //         _min: {
    //           gte: 10,
    //         },
    //       },
    //     },
    //   });
    //   console.log("Exclude Sweden & Ghana:", excludeCountries);
    //   // Contoh 5: Urutkan hasil grup berdasarkan jumlah user per kota (descending)
    //   const groupByCityOrderByCount = await prisma.user.groupBy({
    //     by: ["city"],
    //     _count: {
    //       city: true,
    //     },
    //     orderBy: {
    //       _count: {
    //         city: "desc",
    //       },
    //     },
    //   });
    //   console.log(
    //     "Group by City ordered by number of users:",
    //     groupByCityOrderByCount
    //   );
    //   // Contoh 6: Skip dan Take dalam hasil group
    //   const paginateGroup = await prisma.user.groupBy({
    //     by: ["country"],
    //     _sum: {
    //       profileViews: true,
    //     },
    //     orderBy: {
    //       country: "desc",
    //     },
    //     skip: 2,
    //     take: 2,
    //   });
    //   console.log("Pagination of group (skip 2, take 2):", paginateGroup);
    //   // FAQ Penting:
    //   // -----------------------
    //   // Apakah bisa pakai 'select' dalam groupBy()? → TIDAK BISA
    //   // Semua field di 'by' otomatis dikembalikan.
    //   // Perbedaan 'where' vs 'having':
    //   // - where: menyaring data SEBELUM dikelompokkan
    //   // - having: menyaring hasil grup berdasarkan nilai agregat (misal rata-rata, total, dst)
    //   // Perbedaan 'groupBy' dan 'distinct':
    //   // - distinct: hanya mengambil satu record unik per kombinasi field
    //   // - groupBy: bisa melakukan agregasi dalam tiap grup (misal sum, avg, count)
    //   // ⚠ Catatan:
    //   // Jika kamu menggunakan skip/take, wajib menyertakan orderBy
    //   // Kamu hanya bisa orderBy field yang ada di 'by' atau hasil agregat
    //   // Contoh salah (jangan lakukan filter di 'having' untuk field biasa):
    //   // having: {
    //   //   country: { not: 'Ghana' } // ❌ SALAH → field biasa, bukan agregat
    //   // }
    //   // Yang benar:
    //   // where: {
    //   //   country: { not: 'Ghana' } // ✅ Gunakan di 'where' untuk field biasa
    //   // }
    // }
    // main()
    //   .then(() => prisma.$disconnect())
    //   .catch((e) => {
    //     console.error(e);
    //     prisma.$disconnect();
    //   });
  });
});
