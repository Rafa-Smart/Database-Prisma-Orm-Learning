// https://chatgpt.com/c/686d2e49-637c-8009-80fc-f38c28c0c76f

// lihat penjelasn saya di src tentang objek prisma

import { PrismaClient } from "@prisma/client";
// disini kita import dulu si prismaClientnnya
// yang sadah punya struktur datbase kita, dan bisa dia manipulasi

// Jadi setiap kali saya membuat schema dan ini sudah terintegrasi dengan database 
// menggunakan migrate, saya bisa generate Prisma Client, yang fungsinya adalah:

// Agar saya bisa memanipulasi database (CRUD) menggunakan perintah-perintah otomatis
// yang sudah dibuat oleh Prisma Client.
// jadi nanti yang berintraksi ke datbase itu bukan perinh sql kita secara manual
// tapi nanti si prisma client ini yang sudah mengerti struktur database kita
// lalu akan dibuatka fungsi fungsi yang bisa memanipulasi ke database kita
// tanpa perintah raw sql

// import { PrismaClient } from '@prisma/client'
// Ini mengimpor Prisma Client, yaitu library JavaScript/TypeScript yang di-generate oleh Prisma berdasarkan skema database kamu (schema.prisma).

// Library ini berisi metode-metode CRUD (Create, Read, Update, Delete) yang sesuai dengan struktur tabel yang kamu definisikan di Prisma.

import  prismaClient  from "../src/prisma";

it("testing", async () => {
  // disini kita gunakan si prisma clientnya
  // untuk memebuat instance objek, agar bisa menggunakan seluruh fungsi dari si PrismaClient
  // const prisma = new PrismaClient();
  // await prisma.$connect();

  // // kode interaksi dengan database akan diletakkan di sini
  // await prisma.$disconnect();

  //   PENTING
  //   jdai kegunaan kode connect dan disconnect ini adalah
  //   Jika kamu hanya ingin pakai Prisma di proyek API biasa (Express, Nest, dsb), kamu tidak perlu pakai $connect() / $disconnect() — Prisma sudah cukup pintar
  // (jadi sudah otomatis dibuatkan konek dan diskoneknya).



  // Tapi kalau kamu menulis test atau script satu kali jalan, wajib pakai keduanya agar koneksi dibuka dan ditutup dengan benar.


  // prismaClient.$connect()

  // lakukan sesuatu ke dtabase

  // prismaClient.$disconnect()
  // disini kita komen aagar nanti prisma konek yang di file lain ga ke diskonek

});

// +-----------------+           +----------------+           +-------------+
// | TypeScript App  | --Query--> Prisma Client  | --SQL----> |   MySQL DB  |
// +-----------------+           +----------------+           +-------------+
//                                       ↑
//                                       |
//                              +------------------+
//                              | schema.prisma    |
//                              | migration folder |
//                              +------------------+
