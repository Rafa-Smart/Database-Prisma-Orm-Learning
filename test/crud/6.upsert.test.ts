import prismaClient from "../../src/prisma";

describe("testing update insert data", () => {
  it("testing 1", async () => {
    // upsert adalah gabungan dari update dan insert (update + insert = upsert).
    // "Kalau datanya sudah ada, perbarui (update). Kalau belum ada, buat baru (insert)."
    // denga data yang sudah ada di insertnya
    // urutan
    // 1. Cari data berdasarkan where
    // 2. Jika ketemu, jalankan update
    // 3. Jika tidak ketemu, jalankan create
    // Output akan selalu satu record yang sudah diinsert atau diupdate.

    // dan where harus uniq / ga ada yang duplikat (yakin)

    const dataImpact = await prismaClient.customer.upsert({
      // jadi kalo ada, maka update, kalo ga ada maka buat baru
      where: {
        email: "udin@gmail.com",
      },
      update: {
        email: "udin1205@gmail.com",
      },
      create: {
        id: "009",
        nama: "udin",
        email: "udin@gmail.com",
        phone: "08757483223",
      },
    });

    console.log(dataImpact);

    // CATATAN PENTING: Masalah Race Condition
    // Jika 2 proses menjalankan upsert() pada data yang sama secara bersamaan, dan data
    // belum ada, keduanya akan mencoba create → salah satunya akan gagal.
  });
});


// test