import prismaClient from "../src/prisma";

describe("testing sequential transaction", () => {
  it.only("testing sequensial", async () => {
    const [ucup, budi]:Rafa.TypeCustomer[] = await prismaClient.$transaction([
      // ini elemn array yg pertama
      prismaClient.customer.create({
        data: {
          id: "006",
          nama: "ucup",
          email: "ucupSurucup@gmail.com",
          phone: "22221122",
        },
      }),
      // ini elemen yg kedua
      prismaClient.customer.create({
        data: {
          id: "005",
          nama: "budi",
          email: "Budi@gmail.com",
          phone: "2214556",
        },
      }),
    ]);

    console.log(ucup)
    console.log('--------------')
    console.log(budi)

  });

  it("penjelasan...", async () => {
    // DEFINISI:
    // Sequential transaction (transaksi sekuensial) di Prisma adalah cara untuk mengeksekusi beberapa operasi database
    // secara berurutan (batch) dalam SATU konteks transaksi menggunakan ARRAY dari query Prisma.
    // Semua operasi dituliskan dalam satu array dan dikirim sekaligus ke database oleh Prisma.
    // Jika salah satu query di dalam array gagal, maka seluruh transaksi dibatalkan (rollback) otomatis.
    // Ini menjaga konsistensi data agar tidak ada sebagian data yang tersimpan.
    // SINTAKS DASAR:
    // await prisma.$transaction([
    //   operasi_1,
    //   operasi_2,
    //   ...
    // ])
    // CATATAN:
    // - Tidak bisa menggunakan IF, WHILE, atau logika lain di antara operasi
    // - Semua query ditentukan sejak awal dan tidak bisa dinamis berdasarkan hasil query sebelumnya
    // - Cepat dan optimal jika semua operasinya bersifat tetap (static)
    // KEUNTUNGAN:
    // - Kode lebih pendek dan ringkas
    // - Performa tinggi karena batch dikirim sekaligus
    // - Otomatis rollback jika ada error
    // KEKURANGAN:
    // - Tidak cocok untuk logika kompleks
    // - Tidak bisa buat keputusan berdasarkan hasil query sebelumnya
    // CONTOH IMPLEMENTASI:
    // async function sequentialTransaction() {
    //   const result = await prisma.$transaction([
    //     // Membuat user baru
    //     prisma.user.create({
    //       data: {
    //         name: "Charlie",
    //         email: "charlie@example.com",
    //       },
    //     }),
    // Membuat post untuk user tersebut berdasarkan email
    // Perhatikan: kita langsung connect menggunakan email tanpa cek terlebih dahulu
    //     prisma.post.create({
    //       data: {
    //         title: "Postingan Charlie",
    //         content: "Isi dari postingan ini...",
    //         author: {
    //           connect: {
    //             email: "charlie@example.com",
    //           },
    //         },
    //       },
    //     }),
    //   ]);
    //   console.log("Hasil transaksi sekuensial:", result);
    // CARA KERJA LANGKAH DEMI LANGKAH:
    // 1. Prisma membuat koneksi transaksi ke database
    // 2. Operasi pertama: insert user → dikirim ke MySQL
    // 3. Operasi kedua: insert post → dikirim juga
    // 4. Jika kedua operasi berhasil → Prisma melakukan COMMIT
    // 5. Jika salah satu gagal → Prisma melakukan ROLLBACK (membatalkan semua)
    // CONTOH KASUS GAGAL:
    // Jika email "charlie@example.com" sudah ada (unik), maka query pertama gagal
    // → seluruh transaksi dibatalkan, termasuk post-nya
    // NOTE TAMBAHAN:
    // - Transaksi ini hanya mendukung operasi statis
    // - Tidak bisa melakukan kondisi seperti:
    //     if (user.role === "admin") { buat post admin }
    // PERBANDINGAN DENGAN QUERY BIASA (TANPA TRANSAKSI):
    // Tanpa transaksi, jika kita create user lalu post di dua baris terpisah dan post gagal,
    // maka user sudah terbuat (data jadi tidak konsisten)
    // PEMAKAIAN YANG DIREKOMENDASIKAN:
    // - Saat operasi yang akan dilakukan sudah pasti
    // - Insert/update/delete yang sederhana
    // - Tidak ada logika atau syarat berdasarkan hasil sebelumnya
    //     async function main() {
    //       console.clear();
    //       await sequentialTransaction();
    //     }
    //     main()
    //       .catch((err) => {
    //         console.error("Terjadi error:", err);
    //       })
    //       .finally(async () => {
    //         await prisma.$disconnect();
    //       });
    //   });
  });
});
