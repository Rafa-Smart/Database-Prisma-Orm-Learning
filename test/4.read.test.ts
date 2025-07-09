import prismaClient from "../src/prisma";
// https://www.prisma.io/docs/orm/reference/prisma-client-reference#model-queries
// https://www.prisma.io/docs/orm/prisma-client/queries/crud#read
describe("read data pake prisma", () => {
  it("test read 1 data unique", async () => {
    // jadi null kalo ga ketemu
    const dataImpact: Rafa.TypeCustomer | null =
      await prismaClient.customer.findUnique({
        // harus pake filed yang unique wajib
        // jadi disini kita cari yang unique
        where: {
          // disini bukan khadafi ya :) tapi hadafi, typo
          email: "rafahadafi1205@gmail.com",
        },
      });

    console.log(dataImpact);
    // {
    //   id: '1234',
    //   nama: 'Rafa Khadafi',
    //   email: 'rafahadafi1205@gmail.com',
    //   phone: '1234567'
    // }
  });
  it("test read 1 data ditentukan", async () => {
    // disini ga bsia pake Rafa.TypeCustomer ya
    // karena pas ditmpilin itu bsia aja ga sesuai sama interfacenya
    // bisa aja cuma return nama
    const dataImpact = await prismaClient.customer.findUnique({
      where: {
        phone: "1235",
      },
      select: {
        nama: true, // jadi hanya tampilkan nama yg lainnya engga
      },
    });

    console.log(dataImpact); // { nama: 'jamal' }
  });
  it("test read 1 data omit (terkecuali)", async () => {
    const dataImpact = await prismaClient.customer.findUnique({
      where: {
        phone: "1234562",
      },
      omit: {
        // jadi akan ditampilkan seluruh fieldnya kecuali field nama
        nama: true,
      },
    });

    console.log(dataImpact); //{ id: '3', email: 'siti@gmailcom', phone: '1234562' }
  });
  it("test read 1 data first", async () => {
    // Mengembalikan satu record pertama yang cocok atau null
    // cari yang pertama kali ketemu, bisa pake field yg ga unik
    const dataImpact = await prismaClient.customer.findFirst({
      where: {
        phone: "1234562",
      },
      omit: {
        // jadi akan ditampilkan seluruh fieldnya kecuali field nama
        nama: true,
      },
    });

    console.log(dataImpact); //{ id: '3', email: 'siti@gmailcom', phone: '1234562' }
  });
  it.only("test read bnayak data ", async () => {
    // https://www.prisma.io/docs/orm/reference/prisma-client-reference#findmany
    // ada banyak options nya di paramnya
    // coba baca aja
    const dataImpact: Rafa.TypeCustomer[] =
      await prismaClient.customer.findMany({
        select: {
          id: true,
          nama: true,
          email: true,
          phone: true,
        },
        orderBy: {
          id: "desc",
        },
      });

    console.log(dataImpact);
    // [
    //   { id: '3', nama: 'siti', email: 'siti@gmailcom', phone: '1234562' },
    //   { id: '2', nama: 'jamal', email: 'jamal@gmailcom', phone: '1235' },
    //   {
    //     id: '1234',
    //     nama: 'Rafa Khadafi',
    //     email: 'rafahadafi1205@gmail.com',
    //     phone: '1234567'
    //   }
    // ]
  });
});
