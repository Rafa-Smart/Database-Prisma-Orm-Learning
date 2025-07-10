import prismaClient from "../src/prisma";
// https://chatgpt.com/c/686e757e-e444-8009-b4aa-7ddc09abf38f
describe("testing transaction interactive", () => {
  // jadi deng nakita menggunaka interactive ini kita bisa
  // lebih flexible

  it.only("interactive transaction", async () => {
    const [data1, data2] = await prismaClient.$transaction(async (prisma) => {
      const dataPertama = await prisma.customer.create({
        data: {
          id: "12543",
          nama: "RizkySalah",
          email: "rizkyy@gmail.com",
          phone: "12534342",
        },
      });
      // disini kita cek, jika ada yang insert nama tapi salah
      // maka kita benarkan

      //   tapi kalo ga ada maka langusng aja return data yang pertama
      // tapi kalo ada, maka kita update dulu, baru kita return akn data pertama(yg salah)
      // dan hasil nya yg benar

      if (dataPertama.nama.includes("Salah")) {
        const HasilBenar = await prisma.customer.update({
          data: {
            nama: "RizkyBenar",
          },
          where: {
            id: "12543",
          },
        });
        return [dataPertama, HasilBenar];
      } else {
        return [dataPertama];
      }
    });

    console.log(data1);
    console.log("--------------");
    console.log(data2);
    // sudah benar datanya
    // +-------+--------------+--------------------------+--------------+
    // | id    | nama         | email                    | phone        |
    // +-------+--------------+--------------------------+--------------+
    // | 005   | budi         | Budi@gmail.com           | 2214556      |
    // | 006   | ucup         | ucupSurucup@gmail.com    | 22221122     |
    // | 009   | udin         | udin@gmail.com           | 08757483223  |
    // | 1234  | Rafa Khadafi | rafahadafi1205@gmail.com | 1234567      |
    // | 12543 | RizkyBenar   | rizkyy@gmail.com         | 12534342     |
    // | 2     | jamal        | jamal@gmailcom           | 1235         |
    // | 3     | siti         | siti12@gmail.com         | 087770209754 |
    // +-------+--------------+--------------------------+--------------+
  });

  it("penjelasan", () => {
    // Interactive Transaction (transaksi interaktif) di Prisma adalah jenis transaksi
    // di mana kita dapat mengeksekusi query database secara fleksibel dalam callback async,
    // menggunakan Prisma Client sementara yang disebut "transaction client" (alias `tx`).
    // KEUNGGULAN TERBESAR:
    // Kita bisa menulis logika kompleks (if, loop, switch, dll) DI DALAM transaksi,
    // dan semua query yang dilakukan menggunakan `tx` berada dalam SATU transaksi database.
    // SINTAKS DASAR:
    // await prisma.$transaction(async (tx) => {
    //   const data1 = await tx.model1.create(...)
    //   if (data1.syarat) {
    //     await tx.model2.create(...)
    //   }
    //   return hasilAkhir
    // })
    // SEMUA query harus menggunakan 'tx' (bukan 'prisma') agar berada dalam transaksi yang sama
    // CONTOH IMPLEMENTASI:
    // async function interactiveTransaction() {
    //   const result = await prisma.$transaction(async (tx:PrismaClient) => {
    //     // 1. Membuat user baru
    //     const user = await tx.user.create({
    //       data: {
    //         name: "Dina",
    //         email: "dina@example.com",
    //       },
    //     });
    //     // 2. Cek: hanya buat post jika email mengandung "example"
    //     if (user.email.includes("example")) {
    //       const post = await tx.post.create({
    //         data: {
    //           title: "Post by Dina",
    //           content: "Dina hanya bisa post jika email valid",
    //           authorId: user.id,
    //         },
    //       });
    //       // 3. Return semua hasil
    //       return { user, post };
    //     }
    //     // Jika tidak memenuhi kondisi, tetap return user
    //     return { user };
    //   });
    //   console.log("Hasil transaksi interaktif:", result);
    // }
    // VISUALISASI LANGKAH
    /*
+-----------------------------------------------------+
| prisma.$transaction(async (tx) => {                 |
|   const user = await tx.user.create(...)            |
|   if (user.email.includes("example")) {             |
|     await tx.post.create(...)                       |
|   }                                                 |
| })                                                  |
+-----------------------------------------------------+
        |
        v
  Transaksi dibuka oleh Prisma
        |
        v
  Langkah 1: INSERT user ke tabel
        |
        v
  Cek kondisi: jika memenuhi -> lanjut
        |
        v
  Langkah 2 (opsional): INSERT post ke tabel
        |
        v
  Semua sukses -> Prisma COMMIT
        |
        v
  Jika error di mana pun -> Prisma ROLLBACK
*/
    // KEUNTUNGAN:
    // + Bisa menambahkan logika bersyarat (if, switch, loop)
    // + Cocok untuk bisnis logic kompleks
    // + Aman: semua rollback otomatis jika satu langkah gagal
    // + Bisa return data akhir dari transaksi
    // KEKURANGAN:
    // - Lebih verbose (panjang) daripada sequential
    // - Harus disiplin menggunakan `tx`, bukan `prisma` biasa
    // - Sedikit lebih lambat dibanding sequential batch (karena lebih banyak kontrol)
    // PERBEDAAN UTAMA DENGAN SEQUENTIAL:
    /*
  Sequential:
    - Semua query dikirim sekaligus
    - Tidak bisa pakai if, switch, dsb.
    - Lebih cepat, tapi kaku

  Interactive:
    - Query dijalankan satu per satu secara async
    - Bisa pakai logika kompleks
    - Lebih fleksibel, cocok untuk aplikasi nyata
*/
    // CONTOH KASUS NYATA:
    // Misalnya kamu ingin:
    // 1. Membuat user
    // 2. Jika role-nya "admin", buatkan akun dashboard khusus
    // 3. Jika user gagal dibuat, jangan buat dashboard
    // TANPA transaksi interaktif, kamu harus pisahkan logic → rawan inkonsistensi
    // DENGAN transaksi interaktif, kamu bisa satukan semua logika dalam satu callback
    // CONTOH ERROR HANDLING:
    //     async function interactiveWithError() {
    //       try {
    //         const result = await prisma.$transaction(async (tx:PrismaClient) => {
    //           const user = await tx.user.create({
    //             data: {
    //               name: "Error User",
    //               email: "dina@example.com", // ← email duplicate untuk trigger error
    //             },
    //           });
    //           const post = await tx.post.create({
    //             data: {
    //               title: "Post gagal karena user error",
    //               content: "Tidak akan sampai ke sini",
    //               authorId: user.id,
    //             },
    //           });
    //           return { user, post };
    //         });
    //         console.log("Sukses:", result);
    //       } catch (err:any) {
    //         console.error("Rollback terjadi karena error:", err.message);
    //       }
    //     }
    //     // REKOMENDASI PEMAKAIAN:
    //     // - Ketika logika tergantung hasil query sebelumnya
    //     // - Jika kamu ingin kombinasi CRUD yang kondisional
    //     // - Dalam kasus real-world seperti registrasi + setup akun + pengiriman email
    //     // PENTING:
    //     // Jangan campurkan `tx.model` dan `prisma.model` di dalam callback
    //     // Semua query harus dari client `tx`, atau hasilnya akan di luar transaksi
    //     async function main() {
    //       console.clear();
    //       await interactiveTransaction();
    //       await interactiveWithError();
    //     }
    //     main()
    //       .catch((err) => {
    //         console.error("Fatal error:", err);
    //       })
    //       .finally(async () => {
    //         await prisma.$disconnect();
    //       });
  });
});
