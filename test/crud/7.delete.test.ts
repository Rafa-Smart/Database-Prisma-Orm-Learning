import prismaClient from "../../src/prisma";

describe("testing delete data", () => {
  // disini kita tambahkan dulu data yang salah
  it("crete record salah", async () => {
    // jadi ini dulu baru yg delete
    const dataImpact: Rafa.TypeCustomer = await prismaClient.customer.create({
      data: {
        id: "007",
        nama: "salah",
        email: "salah12@gmail.com",
        phone: "99864444",
      },
    });

    console.log(dataImpact)
    // berhasil, dan return dta yg di create / insert
  });

  it.only("testing delete 1 data", async () => {
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
});
