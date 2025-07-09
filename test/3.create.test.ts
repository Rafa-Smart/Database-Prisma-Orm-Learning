import { Prisma } from "@prisma/client";
import prismaClient from "../src/prisma";
// https://www.prisma.io/docs/orm/reference/prisma-client-reference#model-queries
// https://www.prisma.io/docs/orm/prisma-client/queries/crud#create
console.clear();
describe("create - insert data menggunkaan prisma", () => {


  it("1. create single", async () => {
    // kalo kita pake create berati kita akan emngembalikan data yang baru dibuat
    // dan create biasa ini return nya adalah
    // Prisma.Prisma__CustomerClient
    

    const dataImpact:Rafa.TypeCustomer = await prismaClient.customer.create({
      data: {
        id: "1234",
        nama: "Rafa Khadafi",
        email: "rafahadafi1205@gmail.com",
        phone: "1234567"
      },
    });
    console.log(dataImpact);
    // {
    //   id: '1234',
    //   nama: 'Rafa Khadafi',
    //   email: 'rafahadafi1205@gmail.com',
    //   phone: '1234567'
    // }

    // jadi cara kerjanya itu perama dia begin (transaction otomatis)
    // lalu insert -> select data yg baru di insert -> commit / rollback(gagal)
  });
  it.only("multiple insert / create data", async () => {
    // nah kalo many -> itu return Prisma.PrismaPromise<Prisma.BatchPayload>
    // coba hover di createMany
    // jadi ini adalah interface yang isinya adalah
    type BatchPayload = {
      count: number;
    };

    // jadi Prisma ini saya ambil dari Prisma yang ada di '@prisma/client'
    // dan ini itu otomais akan transaksi
    // jadi sebenarnya bsia pake Prisma.BatchPayLoad
    // atau langusng BatchPayLoad
    const dataImpact: Prisma.BatchPayload =
      await prismaClient.customer.createMany({
        data: [
          {
            id: "2",
            nama: "jamal",
            email: "jamal@gmailcom",
            phone: "1235",
          },
          {
            id: "3",
            nama: "siti",
            email: "siti@gmailcom",
            phone: "1234562",
          },
        ],
      });

      expect(dataImpact.count).toBe(2)
  });
});
