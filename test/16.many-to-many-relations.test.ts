import prismaClient from "../src/prisma";
import util from "util";
describe("testing many-to-many relations", () => {
  // https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations
  it("memasukan data produk dan data customer ke likes", async () => {
    const dataImpact = await prismaClient.likes.create({
      data: {
        id_customer: "005",
        id_product: 1,
      },
      include: {
        customer: true,
        product: true,
      },
    });
    console.log(dataImpact);
    //    {
    //   id_customer: '005',
    //   id_product: 1,
    //   customer: {
    //     id: '005',
    //     nama: 'budi',
    //     email: 'Budi@gmail.com',
    //     phone: '2214556'
    //   },
    //   product: {
    //     id: 1,
    //     nama: 'Nasi Goreng Spesial',
    //     price: 15000,
    //     stock: 50,
    //     category: 'makanan'
    //   }
    // }
  });

  it.only("masukin data likes produk ke customer", async () => {
    // jadi untuk kita mengkonekannya ga bsia langusng konek
    // jadi kita buat dulu si produknya tapi lewat si customer
    // dan bsia juga sebaliknya
    const dataImpact = await prismaClient.customer.update({
      data: {
        likes: {
          create: {
            id_product: 1,
          },
        },
      },
      where: {
        id: "8090",
      },
    });
    console.log(dataImpact)
  });

  it("hanya bisa menambahkan data lewat likes", async () => {
    // nah isini pas di create many
    // sudah saya setting biar ada banyak customer likes 1 produk yg sama
    // dan ada bnayak produk yg di likes oleh 1 customer
    const dataImpact = await prismaClient.likes.createMany({
      data: [
        {
          id_customer: "006",
          id_product: 11,
        },
        {
          id_customer: "009",
          id_product: 4,
        },
        {
          id_customer: "1234",
          id_product: 14,
        },
        {
          id_customer: "009",
          id_product: 2,
        },

        {
          id_customer: "006",
          id_product: 14,
        },
        {
          id_customer: "1234",
          id_product: 4,
        },
        {
          id_customer: "1234",
          id_product: 2,
        },
        {
          id_customer: "006",
          id_product: 2,
        },
      ],
    });
    console.log(dataImpact);
  });

  it("baca data banyak dari table customer yg pernah likes", async () => {
    // jadi ngambil seluruh data yg pernah komen dan tampilkan selruh relasinya
    // tapi ga peduli pernah punya wallet / comment
    const dataImpact = await prismaClient.customer.findMany({
      where: {
        likes: {
          // jadi cari hanya yg pernah likes produk
          some: {},
        },
      },
      include: {
        likes: {
          include: {
            product: true,
          },
        },
        wallet: true,
        comment: true,
      },
    });
    console.log(util.inspect(dataImpact, { depth: 5 }));
    // console.log(JSON.stringify(dataImpact))
    // keren banget nih
  });
  it("test kita cek siapa aja customer yg like", async () => {
    // siapa aja customer yg like produk yg namanya itu ada Ayamnya
    // nah kalo ini berati likenya itu jadi array
    // nah kalo pake some berati yg penting id array itu ada nama
    // produk yg ada kata Ayam
    const dataImpact = await prismaClient.customer.findMany({
      where: {
        likes: {
          some: {
            product: {
              nama: {
                contains: "Ayam",
              },
            },
          },
        },
      },
      include: {
        wallet: true,
        comment: true,
        likes: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log(util.inspect(dataImpact, { depth: 5 }));
  });
  it.only("test kita cek siapa aja customer yg like", async () => {
    // siapa aja customer yg like produk yg namanya itu
    // semuanya harus ada ayam saja, jadi kalo likenya it
    // array dan obj1 itu aya, dan obj2 itu bakso, maka ga bisa
    // jadinya pake every
    // jadi kalo ada array of objek di likenya
    // maka hanya ambil yg seluruh objek pada arraynya itu terdapat
    // huruf A
    // kalo kata Ayam -> ga ada

    // dan ini akan emngabil data customer yg gapunya like
    // karena dia pake model matematika vascous
    const dataImpact = await prismaClient.customer.findMany({
      where: {
        AND: [
          {
            likes: {
              every: {
                // seluruh produk
                product: {
                  nama: {
                    contains: "A",
                  },
                },
              },
            },
          },
          {
            // pake ini jadi ngambil yg customernya itu punya likes
            likes: {
              some: {},
            },
          },
        ],
      },
      include: {
        wallet: true,
        comment: true,
        likes: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log(util.inspect(dataImpact, { depth: 5 }));
  });

  it("nambah likes dari customer ke product g bisa", async () => {
    // jadi kita buat agar customer yg sudah ada
    // meng likes data products yg sudah ada juga
    // jadi kita ga bisa menggunakan connect dan connectOrCreate
    // pada relasi many-to-many
    // yg menggunakan model likes secara explisit
    // const dataImpact = await prismaClient.customer.update({
    //     data:{
    //         likes:{
    //             connect:{
    //                 id_product:1
    //             }
    //         }
    //     },
    //     where:{
    //         id:'006'
    //     }
    // })
  });
});
