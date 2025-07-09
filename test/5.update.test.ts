import prismaClient from "../src/prisma";

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
  it.only("testing read", async () => {
    const dataImpacts: Rafa.TypeCustomer[] =
      await prismaClient.customer.findMany({
        select: {
          id: true,
          nama: true,
          email: true,
          phone: true,
        },
        orderBy:{
          // jaid diurutkan berdasarkan id secara desc
          id:'desc'
        }
      });

      for (const data of dataImpacts) {
          console.log(`email: ${data.email}\nid:${data.id}`)
      }

      // nah kenapa id yang 3 diurutkan id awal
      // karena kamu tentukan id itu tipe datanya adlah varchar(100)
      // jadi ini ditentukan secra alphabet, jadi '3' itu lebih besar dari '1234'

  });
});
