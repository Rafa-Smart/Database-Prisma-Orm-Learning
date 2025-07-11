import prismaClient from "../../src/prisma";
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
  it("test read bnayak data ", async () => {
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

it("pake contain,endwith, startwith", async () => {
  // jadi ini tuh adalah operator like
  // kalo contain itu artinya = %data%
  // klo endwith = %data
  // kalo startwith = data%

  const dataImpact = await prismaClient.customer.findMany({
    // jadi car seluruh data / baris yg namanya itu awalan u
    where: {
      nama: {
        startsWith: "u",
      },
    },
  });
  expect(dataImpact.length).toBe(2);
  console.log(dataImpact);
});

it("operator and - or", async () => {
  // jadi ktia akn cari daa yang idnya itu 1 dan email harus
  // diakhiri dnegan .com
  // atau cari nama yg berawalan R

  const dataImpact = await prismaClient.customer.findMany({
    // berati ini or dulu
    where: {
      OR: [
        {
          AND: {
            id: "3",
            email: {
              endsWith: ".com",
            },
          },
        },
        {
          nama: {
            startsWith: "R",
          },
        },
      ],
    },
  });
  //   +-------+--------------+--------------------------+--------------+
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
  // harusnya bakal dapet 3 yaitu
  // denga id 3, 1234, 12543
  expect(dataImpact.length).toBe(3)
  console.log(dataImpact); // benar
});


it.only('paging', async () => {
  // mmebuat pagination
  // https://www.prisma.io/docs/orm/prisma-client/queries/pagination

  const dataImpacts = await prismaClient.customer.findMany({
    select:{
      id:true,
      nama:true
    },
    take:5,
    skip:0,
    orderBy:{
      id:'asc'
    }
  })
    // [
    //   { id: '005', nama: 'budi' },
    //   { id: '006', nama: 'UcupBenar' },
    //   { id: '009', nama: 'udin' },
    //   { id: '1234', nama: 'Rafa Khadafi' },
    //   { id: '12543', nama: 'RizkyBenar' }
    // ]

  console.log(dataImpacts)
})

it("penjelasan", async () => {
  // const users = await prisma.user.findMany({
  //   where: {
  //     OR: [
  //       {
  //         name: {
  //           startsWith: "E",
  //         },
  //       },
  //       {
  //         AND: {
  //           profileViews: {
  //             gt: 0,
  //           },
  //           role: {
  //             equals: "ADMIN",
  //           },
  //         },
  //       },
  //     ],
  //   },
  // });
  //   Prioritas utama di Prisma: ditentukan oleh struktur JSON.
  // Dalam kode ini:
  // Prisma melakukan evaluasi OR lebih dulu, karena OR berada di luar (top-level).
  // Di dalam salah satu opsi OR, ada AND, yang berarti AND hanya dievaluasi jika kondisi itu dipilih oleh OR.
  // dan ini adalh perintah sql rawnya
  //   SELECT *
  // FROM user
  // WHERE
  //   name LIKE 'E%'
  //   OR (
  //     profileViews > 0
  //     AND role = 'ADMIN'
  //   );
});
