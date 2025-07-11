import prismaClient from "../src/prisma"

describe('testing agregate', () => {
    it('test agregate count (fungsi sendiri)', async () => {
        // jadi agregate count ini punya fungsi sendiri
        // kita hitung baris yang namanya itu diawali dengan huruf
        // R
        const dataImpact = await prismaClient.customer.count({
            where:{
                nama:{
                    startsWith: "R"
                }
            }
        });

        console.log(dataImpact) // 2
        console.log(typeof dataImpact) // number
        // jadi sebenarnya nanti dia akn retun sebuah objek yag punya bnayk
        // prperty, nanti lihat saja
        // pas di expect(dataImpact.) nah nanti ada
    });

    it('create banyak data dari tabel baru', async () => {
        
    })

    it('testing agreagate lain', async () => {
        // tapi sebelumnya, fungsi agregate di prisma itu hanya dikit
        // jadi ga semua, makanya harus pake raw sql klo mau

    })
})