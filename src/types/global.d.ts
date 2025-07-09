// disini kita akan membaut vairable global untuk interface interface kita
// jadi aga bsia diakses dimanapun
// tapi emnggunakan namespace juga agar tidak bentrok
// jadi seiap isi baru, maka refesh atau tutup lagi vscodenya
export {};

declare global {
  namespace Rafa {
    interface TypeCustomer {
      id: string;
      nama: string;
      email: string;
      phone: string;
    } 
  }
}
