import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AutomacaoClient from "./AutomacaoClient";

export default async function AutomacaoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <AutomacaoClient />;
}
