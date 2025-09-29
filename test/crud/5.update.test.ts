import prismaClient from "../../src/prisma";

describe("update data menggunakan prisma", () => {
  // aturan aturan menggunakan update data
  // https://www.prisma.io/docs/orm/reference/prisma-client-reference#atomic-number-operations
  it("test update data", async () => {
    // dan where ini wajib menggunakna field yang unique
    // kalo engga nanti bakalan error

    const dataImpact = await prismaClient.customer.update({
      // jadi param yg wajib itu data dan where
      // omit dan select itu opsional, dll

      // dan kalo ga ketemu nanti bakalan error
      // jadi where ini harus benar dan pastikan dulu ada

      data: {
        // ini sama kayak set di mysql
        phone: "087770209754",
        email: "siti12@gmail.com",
      },
      where: {
        email: "siti@gmailcom",
      },
    });

    console.log(dataImpact);
  });
  it("testing read", async () => {
    const dataImpacts: Rafa.TypeCustomer[] =
      await prismaClient.customer.findMany({
        select: {
          id: true,
          nama: true,
          email: true,
          phone: true,
        },
        orderBy: {
          // jaid diurutkan berdasarkan id secara desc
          id: "desc",
        },
      });

    for (const data of dataImpacts) {
      console.log(`email: ${data.email}\nid:${data.id}`);
    }

    // nah kenapa id yang 3 diurutkan id awal
    // karena kamu tentukan id itu tipe datanya adlah varchar(100)
    // jadi ini ditentukan secra alphabet, jadi '3' itu lebih besar dari '1234'
  });

  it("update banyak data", async () => {
    // nah jadi kalo update impact ini akna menjadi transaksi
    // karena banyak,
    // dan nanti where nya boleh data yang bukan uniq
    // jadi agar impactnya bisa banyak

    // jadi ktia update data nama ucup menjadi ucupBenar
    // da harusnya kalo kia pake nama, nama iu kan tidak uniq harusnya
    // kalo ada nama ucup yang banyak, maka akna di ganti semuanya
    // dan ini akn return bnayak data yang kena impact
    const dataImpact = await prismaClient.customer.updateMany({
      data: {
        nama: "UcupBenar",
      },
      where: {
        nama: "ucup",
      },
    });

    expect(dataImpact.count).toBe(1)
  });

  it.only('test', async () => {
    const hasil = prismaClient.siswa.create({
      data: {
          
      }
      
    })
  })
});
