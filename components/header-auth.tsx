import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   await supabase.auth.updateUser({
  //       data: { is_admin: true },
  //   });

  const { data: userData, error } = await supabase
    .from("patient")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Portal Pacientes</Link>
            </Button>
            {/* <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Registrarse</Link>
            </Button> */}
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      {userData ? (
        <Link href={"/protected/profile"}>Hola, {userData.name}!</Link>
      ) : (
        <span> Completa tus datos</span>
      )}
      {user!.user_metadata?.is_admin && (
        <>
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/protected/admin">Admin</Link>
          </Button>
        </>
      )}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Salir
        </Button>
      </form>
    </div>
  ) : (
    <>
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Portal Pacientes</Link>
        </Button>
        {/* <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Registrarse</Link>
        </Button> */}
      </div>
    </>
  );
}
