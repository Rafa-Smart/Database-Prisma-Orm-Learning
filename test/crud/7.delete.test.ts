import prismaClient from "../../src/prisma";

describe("testing delete data", () => {
  // disini kita tambahkan dulu data yang salah
  it("crete record salah", async () => {
    // jadi ini dulu baru yg delete
    const dataImpact = await prismaClient.customer.createMany({
      data: [
        {
        id: "007",
        nama: "salah",
        email: "salah12@gmail.com",
        phone: "998644344",
      },
        {
        id: "008",
        nama: "salah2",
        email: "salah1226@gmail.com",
        phone: "9986443344244",
      },
        {
        id: "003",
        nama: "salah2",
        email: "salah122@gmail.com",
        phone: "9986434244",
      },

    ],
    });

    console.log(dataImpact)
    // berhasil, dan return dta yg di create / insert
  });

  it("testing delete 1 data", async () => {
    // jadi where ini wajib untuk ada dan unique atau
    // field yg bukan unique tapi yakin unique
    const dataImpact = await prismaClient.customer.delete({
      where: {
        email: "salah12@gmail.com",
      },
      select: {
        id: true,
        nama: true,
        email: true,
        phone: true,
      },
    });

    console.log(dataImpact)
    // return data yang di delete
  });

  it.only('delete data yang bnyak sekaligus', async () => {
    // jadi kita akan delete data nama yang 
    // memiliki kata salah

    const dataImpact = await prismaClient.customer.deleteMany({
      where:{
        nama:{
          contains:
          "salah",
        }
      }
    })

    console.log(dataImpact) // { count: 3 }
  })
});
