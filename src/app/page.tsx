// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
//
// export default async function Home() {
//   const { userId } = auth();
//
//   if (userId) {
//     redirect("/dashboard"); // Якщо залогінений — одразу в дашборд
//   } else {
//     redirect("/sign-in"); // Якщо ні — на сторінку входу Clerk
//   }
//
//   return null;
// }
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/dashboard");
}


