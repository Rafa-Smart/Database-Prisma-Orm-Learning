import prismaClient from "../src/prisma";
import util from "util";

describe("testing", () => {
  it("test 1..", async () => {
    // jadi kita akn connectkan data customer
    // yg belum komen ke komen yg belum punya customer
    const dataImpact = await prismaClient.customer.update({
      data: {
        comment: {
          connectOrCreate: {
            where: {
              id: 1,
            },
            create: {
              id: 1,
              title: "keren banget",
              description: "hebat animasinya",
            },
          },
        },
      },
      where: {
        id: "005",
      },
      include: {
        comment: true,
        wallet: true,
      },
    });
    console.log(dataImpact);
  });
  it("test hubungkan banyak customer ke coment langsung", async () => {
    const dataImpact = await prismaClient.$transaction(async (prisma) => {
      const data1 = await prisma.customer.update({
        data: {
          comment: {
            connect: {
              id: 2,
            },
          },
        },
        where: {
          id: "1234",
        },
        include: {
          wallet: true,
          comment: true,
        },
      });

      const data2 = await prisma.customer.update({
        data: {
          comment: {
            connect: {
              id: 3,
            },
          },
        },
        where: {
          id: "4",
        },
        include: {
          wallet: true,
          comment: true,
        },
      });

      return [data1, data2];
    });

    // const [dataHasil1, dataHasil2] = dataImpact;
    for (let i = 0; i < dataImpact.length; i++) {
      console.log(dataImpact[i]);
    }
  });
  it("testing tambah konek in ke customer dan buat baru comment", async () => {
    const dataImpact = await prismaClient.customer.update({
      data: {
        comment: {
          create: {
            title: "wow",
            description: "keren pisann",
          },
        },
      },
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
  it("langusng daftarin banyak data komen ke customer", async () => {
    const dataImpact = await prismaClient.comment.createMany({
      data: [
        {
          title: "wow2",
          description: "tambahan2",
          id_customer: "8090",
        },
        {
          title: "wow2",
          description: "tambahan2",
          id_customer: "7534",
        },
        {
          title: "wow2",
          description: "tambahan2",
          id_customer: "006",
        },
        {
          title: "wow2",
          description: "tambahan2",
          id_customer: "009",
        },
      ],
    });
    console.log(dataImpact.count);
  });
  it("langusng daftarin banyak data komen ke customer 2", async () => {
    const dataImpact = await prismaClient.comment.createMany({
      data: [
        {
          title: "wow3",
          description: "tambahan233",
          id_customer: "8090",
        },
        {
          title: "wow3",
          description: "tambahan2444",
          id_customer: "7534",
        },
        {
          title: "wow3",
          description: "tambahan264",
          id_customer: "8090",
        },
        {
          title: "wow3",
          description: "tambahan266",
          id_customer: "7534",
        },
      ],
    });
    console.log(dataImpact.count);
  });

  //   reading data nih
  //   https://chatgpt.com/c/68721911-a790-8009-a548-98619d675e6b
  it("test some", async () => {
    const dataImpact = await prismaClient.customer.findMany({
      // jadi some itu ngambil minimal 1 ada 1 komen yg punya
      // kata kata keren di titlenya

      // nah kan ga semua ada tuh, maka bisa pake some

      where: {
        comment: {
          some: {
            title: {
              contains: "keren",
            },
          },
        },
      },
      include: {
        wallet: true,
        comment: true,
      },
    });
    console.log(
      util.inspect(dataImpact, {
        depth: 5,
      })
    );
  });
  it("test every", async () => {
    // ini kenapa customer yg ga punya comment mlah terselect
    // karena
    // "Ambil semua customer yang SEMUA comment-nya memiliki huruf 'k' di title."
    // TAPI!
    // Jika customer tidak memiliki comment sama sekali, maka Prisma akan
    // menganggap kondisi every SELALU TRUE karena tidak ada satupun comment yang MELANGGAR kondisi tersebut.

    // 📢 Secara logika matematika, ini dikenal sebagai vacuous truth:

    const dataImpact = await prismaClient.customer.findMany({
      // jadi every itu ngambil seluruh komen yg punya
      // huruf h di titlenya

      // nah karena semua ada maka bisa

      where: {
        comment: {
          every: {
            title: {
              contains: "k",
            },
          },
        },
      },
      include: {
        wallet: true,
        comment: true,
      },
    });
    console.log(
      util.inspect(dataImpact, {
        depth: 5,
      })
    );
  });

  it.only("sollusi masalah diatas", async () => {

    // hati hati ketika pake and
    // karena dia harus di array dan pake objek lagi didalmnya baru
    // fieldnya

    const dataImpact = await prismaClient.customer.findMany({
      where: {
        AND: [
          {
            comment: {
              every: {
                title: {
                  contains: "k",
                },
              },
            },
          },
          // {
          // g bisa krn hnya bsia di relasi oneToOne utk IsNot ini
          //   comment:{
          //     isNot:null
          //   }
          // }
          {
            comment: {
              // artinya minimal pada customer itu harus punya koment
              // baru bisa di cek lagi apakah di koment itu ada huruf k
              some: {},
            },
          },
        ],
      },
      include:{
        wallet:true,
        comment:true
      }
    });

    console.log(util.inspect(dataImpact, {depth:5}))
  });
});
