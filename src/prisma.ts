// nah disni kita buat variable yang akan di export keluar
// jda kita variable yang berisi objek instance dari class PrismaClient
// yang punya banyak method yg dikasih ke objek instancenya

// jadi gini
// Setiap kali kamu menulis:

// const prisma = new PrismaClient();
// Maka kamu sedang membuat 1 instance baru dari Prisma Client, yaitu
// objek yang membuka koneksi baru ke database.

// Kalau kamu terus-menerus membuat objek baru seperti ini:
// untuk setiap file testing

// const prisma1 = new PrismaClient();
// const prisma2 = new PrismaClient();
// const prisma3 = new PrismaClient();
// Maka akan terbuka banyak koneksi ke database, dan ini berbahaya:

// Bisa bikin aplikasi lambat

// Bisa menyebabkan leak / memory overload

// Bisa membuat database menolak koneksi baru (karena melebihi batas koneksi)

// nah OLEH KARENA ITU KITA BUAT SAJA SATU KONEKSI
// TAPI DIA AKAN DIPANGGIL BEBERAPA KALI UNTUK BANYAK FILE

import { PrismaClient, Prisma} from "@prisma/client";

// nah disni kita juga buat configurasi si objek instancenya ini
// kayak lognya, mengatur jumlah connector, dll
// https://www.prisma.io/docs/orm/reference/prisma-client-reference
// 1. semua informasi querynya di log
const prismaClient:PrismaClient = new PrismaClient({
    errorFormat:'pretty',
    log:[
        "query", "info", "warn", "error"
    ]
    // jadi kalo ada query, maka di log, kalo ada warn maka di log
})
// jdai ini yang kita pake
export default prismaClient

