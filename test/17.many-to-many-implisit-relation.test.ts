import prismaClient from "../src/prisma";
import util from "util";

describe("testing implisit", () => {
  it("masukin data loves products dari customer", async () => {
    // nah kalo pake relasi many-to-mny biasa
    // kita ga bisa langusng nambahin lewat modelnya
    // jadi harus lewat si model relasinya
    // bisa sih tapi harus create dulu
    // jaid ga bsia langsung konek
    // nah kalo pake ini bisaa

    // jadi ini mengkonekkan customer dgn id 005
    // ke produk id 2 dan 3

    const dataImpact = await prismaClient.customer.update({
      where: {
        id: "005",
      },
      data: {
        loves: {
          connect: [
            // ini konek ke produk yg sudah ada ya
            // dan langsung 2
            {
              id: 3,
            },
            {
              id: 2,
            },
          ],
        },
      },
      include: {
        wallet: true,
        comment: true,
        loves: true, // untuk si produknya
      },
    });
    console.log(util.inspect(dataImpact, { depth: 5 }));
  });

  it.only("buat data customer lewat produk", async () => {
    // buat customer baru lewat produk
    // bisa juga sebaliknya
    // bis apake createOrConnect / create

    // jadi di produk yg idnya 4,
    // kita konek ke customer
    // nah tapi kalo mau konek ini berati harus uniq si fieldnya
    const dataImpact = await prismaClient.product.update({
      where: {
        id: 4,
      },
      data: {
        loves: {
          connectOrCreate: {
            where: {
              email: "customerbaru@gmail.com", // WAJIB field unik
            },
            create: {
              id: "67676",
              nama: "customer baru",
              email: "customerbaru@gmail.com",
              phone: "68687987",
              wallet: {
                create: {
                  id: "7777",
                  balance: 1000,
                },
              },
              // comment tidak bisa connect karena title bukan unik
              // Bisa create comment baru kalau mau
              comment: {
                create: [
                  {
                    title: "keren bangettt",
                    description: "komen otomatis dari sistem",
                  },
                ],
              },
            },
          },
        },
      },
      include: {
        loves: true, // hanya ini yang boleh karena memang relasi langsung
      },
    });
    console.log(util.inspect(dataImpact, { depth: 5 }));
  });
  it.only("masukin data loves customer dari products", async () => {
    // jadi disini produk id 4 di loves oleh customer id 009 dan 006
    const dataImpact = await prismaClient.product.update({
      where: {
        id: 4,
      },
      data: {
        loves: {
          connect: [
            {
              id: "009",
            },
            {
              id: "006",
            },
          ],
        },
      },
      include: {
        // disini ga bisa karena wallet dan comment
        // gapunya relasi sma si produk
        // wallet:true,
        // comment:true,
        loves: true, // untuk si produknya
      },
    });
    console.log(util.inspect(dataImpact, { depth: 5 }));
  });

  it("penjelasan", () => {
    // Prisma ORM memungkinkan relasi antar model dalam database secara otomatis.
    // Salah satu relasi yang penting dan umum adalah "many-to-many" (banyak ke banyak).
    // Relasi ini digunakan ketika satu entitas bisa memiliki banyak entitas lainnya, dan sebaliknya.
    // Contoh kasus:
    // - Satu Post bisa masuk ke banyak Category (misal: Magic, News, Sport)
    // - Satu Category bisa punya banyak Post (misal: Category "Magic" punya 5 artikel)
    // ==============================
    // APA ITU MANY-TO-MANY IMPLISIT?
    // ==============================
    // Implicit many-to-many relation adalah jenis relasi di mana Prisma otomatis membuat
    // tabel pivot (relasi) tanpa kamu harus mendefinisikannya secara eksplisit.
    // Dalam model Prisma, cukup mendeklarasikan array dari model lain di kedua sisi relasi,
    // dan Prisma akan otomatis menangani tabel relasi di database (tanpa perlu model pivot).
    // Contoh Prisma schema:
    /*
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[] // ← array menandakan relasi many-to-many
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[] // ← array menandakan relasi many-to-many
}
*/
    // ==============================
    // BAGAIMANA CARA KERJANYA?
    // ==============================
    // Prisma secara otomatis akan membuat sebuah tabel relasi, misalnya:
    // "_CategoryToPost" yang berisi dua kolom foreign key:
    // - "A" → referensi ke Category (model alfabet pertama)
    // - "B" → referensi ke Post (model alfabet kedua)
    // Dan juga index unik serta index tambahan untuk performa query.
    // Tabel ini tidak perlu kamu definisikan secara manual.
    // Kamu cukup menyatakan array di kedua sisi model, Prisma akan membuat sisanya.
    // ==============================
    // MENGAPA MENGGUNAKAN IMPLISIT MN RELATION?
    // ==============================
    // ✔ Lebih ringkas dan mudah ditulis
    // ✔ Tidak perlu membuat model pivot/relasi secara manual
    // ✔ Cukup untuk kasus di mana kamu tidak butuh data tambahan di relasi
    // ✘ Tidak bisa menyimpan informasi tambahan seperti tanggal join, role, dll
    // ✘ Kurang fleksibel dibanding eksplisit jika perlu kontrol detail relasi
    // Gunakan relasi implisit ketika:
    // - Tidak butuh informasi ekstra di relasi (misalnya tanggal like, dsb)
    // - Ingin menulis kode yang lebih sederhana
    // - Tidak butuh onDelete/onUpdate custom behavior
    // Jika kamu perlu simpan data di relasi, gunakan relasi many-to-many eksplisit.
    // async function main() {
    //   // Membuat satu post dengan dua kategori baru
    //   const createPostWithCategories = await prismaClient.post.create({
    //     data: {
    //       title: "How to become a butterfly",
    //       categories: {
    //         create: [{ name: "Magic" }, { name: "Butterflies" }],
    //       },
    //     },
    //   });
    //   // Membuat satu kategori dengan dua post baru
    //   const createCategoryWithPosts = await prismaClient.category.create({
    //     data: {
    //       name: "Stories",
    //       posts: {
    //         create: [
    //           { title: "That one time with the stuff" },
    //           { title: "The story of planet Earth" },
    //         ],
    //       },
    //     },
    //   });
    //   // Menampilkan semua post dan kategorinya
    //   const postsWithCategories = await prismaClient.post.findMany({
    //     include: {
    //       categories: true,
    //     },
    //   });
    //   console.log("All Posts with Categories:", postsWithCategories);
    //   // Menampilkan semua kategori dan post di dalamnya
    //   const categoriesWithPosts = await prismaClient.category.findMany({
    //     include: {
    //       posts: true,
    //     },
    //   });
    //   console.log("All Categories with Posts:", categoriesWithPosts);
    //   // Menyambungkan kategori yang sudah ada ke post yang sudah ada (pakai connect)
    //   const connectExisting = await prismaClient.post.update({
    //     where: { id: 1 }, // pastikan ID 1 ada
    //     data: {
    //       categories: {
    //         connect: [{ id: 2 }, { id: 3 }], // pastikan ID 2 & 3 ada
    //       },
    //     },
    //   });
    //   // Atau kamu juga bisa disconnect atau set ulang
    //   // Misalnya ingin replace semua kategori dengan hanya satu kategori
    //   const updateWithSet = await prismaClient.post.update({
    //     where: { id: 1 },
    //     data: {
    //       categories: {
    //         set: [{ id: 3 }], // hanya relasi ke kategori id 3
    //       },
    //     },
    //   });
    // }
    // main()
    //   .catch((e) => {
    //     console.error(e);
    //   })
    //   .finally(async () => {
    //     await prismaClient.$disconnect();
    //   });
    // ==============================
    // CATATAN KHUSUS UNTUK MONGO DB
    // ==============================
    // Prisma TIDAK mendukung relasi many-to-many implisit di MongoDB
    // Untuk MongoDB, kamu harus menggunakan relasi eksplisit dengan daftar ID skalar
    // dan menuliskan @relation(fields: [...], references: [...]) secara manual
    // ==============================
    // KAPAN HARUS GUNAKAN MN-EXPLICIT?
    // ==============================
    // Gunakan eksplisit jika:
    // - Perlu menyimpan metadata di relasi (misal: likedAt, status, dsb)
    // - Perlu foreign key control seperti onDelete: Cascade
    // - Perlu mengakses tabel relasi secara langsung
    // - Perlu custom nama tabel relasi dan field nya
    // Contoh eksplisit:
    // model PostCategory {
    //   postId Int
    //   categoryId Int
    //   createdAt DateTime @default(now())
    //   post Post @relation(fields: [postId], references: [id])
    //   category Category @relation(fields: [categoryId], references: [id])
    //   @@id([postId, categoryId])
    // }
    // ==============================
    // PENUTUP
    // ==============================
    // Relasi many-to-many implisit adalah cara cepat dan efisien untuk membuat hubungan ganda dua arah tanpa perlu model pivot.
    // Ini sangat cocok digunakan di awal atau untuk struktur data sederhana.
    // Prisma akan mengatur tabel relasi, foreign key, dan indeks untuk kamu.
    // Pastikan hanya digunakan jika kamu tidak butuh data tambahan di relasi.
  });
});
