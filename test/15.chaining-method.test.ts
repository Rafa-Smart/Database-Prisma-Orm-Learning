import prismaClient from "../src/prisma";

describe("chaining method in prisma keren", () => {
  // jadi hanya bisa di relasi oneToOne atau pada
  // relasi lain tapi mengunakan findUnique / findFirst
  it("dari relasi oneToOne", async () => {
    // jadi akna emngabil data wallet yg id customernya itu
    // adaah 2
    const dataImpact = await prismaClient.customer
      .findUnique({
        where: {
          id: "2",
        },
      })
      .wallet();
    // }).wallet().comment() -> ga bisa karena
    //.wallet() mengembalikan objek Wallet, tapi:
    // Wallet tidak punya relasi langsung ke Comment, jadi Prisma tidak bisa
    // otomatis mengenali .comment() setelahnya.
    console.log(dataImpact);
  });
  it.only("sama aja kayak yg atas", async () => {
    const dataImpact = await prismaClient.customer.findUnique({
      where: {
        id: "2",
      },
      include: {
        wallet: true,
        comment: true,
      },
    });
    console.log(dataImpact);
  });

  //   dan untuk yg relasi selain oneToOne uga bisa
  // tapi saya alas demokannya
//   karea sama aja, asal ga boleh pake findmany
});
