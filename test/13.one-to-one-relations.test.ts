import prismaClient from "../src/prisma";

describe("testing", () => {
  it("testing diwallet", async () => {
    // disini ktia tambahkan 1 customer ke wallet
    // dan sekalian kita include pas di select
    const dataImpact = await prismaClient.wallet.create({
      data: {
        id: "1",
        id_customer: "2",
        balance: 100000,
      },
      // disni ktia include si customer biar, nanti pas di seelct ada
      include: {
        customer: true,
      },
    });

    console.log(dataImpact);
  });
  it("testing lansung banyak diwallet", async () => {
    const dataImpact = await prismaClient.wallet.createMany({
      data: [
        {
          id: "2",
          id_customer: "005",
          balance: 247744,
        },
        {
          id: "3",
          id_customer: "3",
          balance: 234444,
        },
      ],
    });

    console.log(dataImpact.count); // 2
  });
  it("buat data di customer + langusng si wallet", async () => {
    const dataImpact = await prismaClient.customer.create({
      data: {
        id: "4",
        nama: "tayo",
        email: "tayo@gmail.com",
        phone: "4534246",
        wallet: {
          create: {
            id: "4",
            balance: 7454342,
            // disini ausah tambahin si id_customer
            // karena suah otomatis
          },
        },
      },
      include: {
        wallet: true,
      },
    });
    console.log(dataImpact);
  });
  it("create customer lewat wallet sekeligus", async () => {
    const dataImpact = await prismaClient.wallet.create({
      data: {
        id: "5",
        balance: 1232321,
        customer: {
          create: {
            id: "8090",
            nama: "nopal",
            email: "nopal",
            phone: "234234",
          },
        },
      },
      include: {
        customer: true,
      },
    });
    console.log(dataImpact);
  });
  it("buat wallet ketika update data customer", async () => {
    const dataImpact = await prismaClient.customer.update({
      data: {
        nama: "fuji",
        email: "fuji@gmail.com",
        phone: "079879",
        wallet: {
          create: {
            id: "6",
            balance: 70870,
          },
        },
      },
      where: {
        id: "009",
      },
      include: {
        wallet: true,
      },
    });

    console.log(dataImpact);
  });
  it("test read data include", async () => {
    const dataImpact = await prismaClient.customer.findMany({
      where: {
        id: "009",
      },
      include: {
        wallet: true,
      },
    });
    // [
    //   {
    //     id: '009',
    //     nama: 'fuji',
    //     email: 'fuji@gmail.com',
    //     phone: '079879',
    //     wallet: { id: '6', balance: 70870, id_customer: '009' }
    //   }
    // ]
    console.log(dataImpact);
  });
  it("reading data select", async () => {
    // kita cari customer yg punya wallet saja
    const dataImpact = await prismaClient.customer.findMany({
      where: {
        // kalo ga pake ini
        // nanti yg ga punya wallet juga ke select
        wallet: {
          isNot: null,
        },
      },
      select: {
        id: true,
        nama: true,
        email: true,
        phone: true,
        wallet: {
          select: {
            id: true,
            balance: true,
            id_customer: true,
          },
        },
      },
    });
    console.log(dataImpact.length); // 6
  });
  it("connect testing kalo di one to one", async () => {
    // /karena harus ada data wallet yg kosong
    // makanya kita buat dulu yg kosongnya

    // disni kita akn mengkonekan data customer ke wallet
    // jaid ada customer yg belum punya wallet
    // jadi akna kita connectkan

    // dan bsia juga sebaliknya jadi dari wallet ke customer

    const dataImpact = await prismaClient.customer.update({
      data: {
        // disini kita conek kin customer
        // yg belum punya wallet
        wallet: {
          connect: {
            id: "076",
          },
        },
      },
      where: {
        id: "12543",
      },
      include: {
        wallet: true,
      },
    });
    console.log(dataImpact);
  });
  it.only("test create or connect", async () => {
    // jaid disini kita akan buat customer baru
    // dan akan konek ke wallet yg belum punya customer
    // dan kalo walletnya belum ada maka buat, tapi kalo udah ada
    // maka langusng konek aja

    // jaid konek ke wallet yg idnya 9989, tapi kao ga ada
    // buat dulu walletnya baru konek
    const dataImpact = await prismaClient.customer.create({
      data: {
        id: "7534",
        nama: "asep",
        email: "asep@gmail.com",
        phone: "09384334",
        wallet: {
          connectOrCreate: {
            where: {
              id: "9989",
            },
            create: {
              id: "9989",
              balance: 53534312,
            },
          },
        },
      },
      include: {
        wallet: true,
      },
    });
    // {     
    //   id: '7534',
    //   nama: 'asep',
    //   email: 'asep@gmail.com',
    //   phone: '09384334',
    //   wallet: { id: '9989', balance: 53534312, id_customer: '7534' }
    // }
    console.log(dataImpact)
  });
  it("nih yg ga bisa", async () => {
    // jadi ga bsia nambah data wallet untuk relation
    // di createmany
    // const dataImpact = await prismaClient.customer.createMany({
    //     data: [
    //         {
    //             id:"0343",
    //             nama:"yoyo",
    //             email:"yoyo@gmail.com",
    //             phone:"1232321312",
    //             wallet: {
    //                 create:{
    //                     id:"5",
    //                     balance:24343243
    //                 }
    //             }
    //         },
    //         {
    //             id:"0343",
    //             nama:"yoyo2",
    //             email:"yoyo2@gmail.com",
    //             phone:"2222",
    //             wallet: {
    //                 create:{
    //                     id:"6",
    //                     balance:24343243
    //                 }
    //             }
    //         }
    //     ]
    // })
  });
});
