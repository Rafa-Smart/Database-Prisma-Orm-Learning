import prismaClient from "../src/prisma";
// jadi agregate itu akna dieksekusi terakhir
describe("testing agregate", () => {
  // testing lagi pake agregate
  it.only("testing function agregate", async () => {
    // jaid gini kita akn mneghitung data rata rata dari price
    // yang kita filter dulu, jadi hanya ngambil yg category makanan
    // lalu di sorting berdasarkan price desc
    // lalu dari data tersebut data price yg dirata ratakan adalah
    // 5 data pertama yg paling mahal pricenya
    const dataImpact = await prismaClient.product.aggregate({
        
        // dan urutan penulisan ga ngaruhnya, jadi tetap where->orderby->skip(kaloada)->take
        // // where

        // // ini keempat
        // _avg:{
        //     price:true
        // },
        // // ini pertama
        // where:{
        //     category:"makanan"
        // },
        // // ini kedua
        // orderBy:{
        //     price:"desc"
        // },
        // // ini ke tiga
        // take:5

        // jadi kita urukan aja biar lebih enak
        where:{ // 1
            category:'makanan'
        },
        orderBy:{ // 2
            price:'desc'
        },
        take:5, // 3
        _avg:{ // 4
            price:true
        }
    });

    console.log(dataImpact)
    // kalo pake raw query
    //  select avg(test.price) from (select price from products
    //  where category = "makanan"
    //  order by price desc
    //  limit 0,5) as test;
  });

  it("test agregate count (fungsi sendiri)", async () => {
    // jadi agregate count ini punya fungsi sendiri
    // kita hitung baris yang namanya itu diawali dengan huruf
    // R
    const dataImpact = await prismaClient.customer.count({
      where: {
        nama: {
          startsWith: "R",
        },
      },
    });

    console.log(dataImpact); // 2
    console.log(typeof dataImpact); // number
    // jadi sebenarnya nanti dia akn retun sebuah objek yag punya bnayk
    // prperty, nanti lihat saja
    // pas di expect(dataImpact.) nah nanti ada
  });

  it("testing groupby", async () => {
    // tapi sebelumnya, fungsi agregate di prisma itu hanya dikit
    // jadi ga semua, makanya harus pake raw sql klo mau

    // disini kita akan agreagate rata rata berdasarkan category


    const dataImpact = await prismaClient.product.groupBy({
      by: ["category"],
      _avg: {
        price: true,
      },
    });

    console.log(dataImpact);
    // [
    //   { _avg: { price: 16000 }, category: 'makanan' },
    //   { _avg: { price: 8333.3333 }, category: 'minuman' },
    //   { _avg: { price: 1075 }, category: 'lain lain' }
    // ]
  });

  it("testing mencari seluruh data yang pricenya lebih dari rata rata", async () => {
    // disini ga bisa langusng ya, tpai bsia gini
    const jumlahRata = await prismaClient.product.aggregate({
      _avg: {
        price: true,
      },
    });

    console.log(jumlahRata); // { _avg: { price: 10715 } }

    // kalo mau gini
    const hasilJumlahRata = jumlahRata._avg.price ?? 0;

    const hasilImpact = await prismaClient.product.findMany({
      where: {
        price: {
          gt: hasilJumlahRata, // as number // karena ini bsia null
        },
      },
    });

    console.log(hasilImpact.length); // 10
  });

  it("testing tapi pake raw querry", async () => {
    // ini lebh komplks lagi
    const dataImpact =
      await prismaClient.$queryRaw`select category, avg(price) as rata_category from products group by (category);`;
    // [
    //   { category: 'makanan', rata_category: 16000 },
    //   { category: 'minuman', rata_category: 8333.3333 },
    //   { category: 'lain lain', rata_category: 1075 }
    // ]
    console.log(dataImpact);
  });

  it("sama coba lagi", async () => {
    // cari seluruh produk yg pricenya lebih dari rata rata
    // dan dicar dari harga termahal
    const dataImpact =
      await prismaClient.$queryRaw`select * from products where price > (select avg(price) from products) order by price desc;`;
    console.log(dataImpact);
  });
});
// test
// test
// test
// test
// test
// test
// test
// test
// test 
// test 
// test 
// test 
// test 
// test 
// test 
// test 