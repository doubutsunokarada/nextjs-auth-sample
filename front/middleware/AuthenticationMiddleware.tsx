import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export default function AuthenticationMiddleware({
  children,
}: {
  children: React.ReactElement;
}): any {
  const { status } = useSession();
  const router = useRouter();
  console.log(status);
  React.useEffect(() => {
    if (status === "unauthenticated") {
      if (router.pathname !== "/auth/signin") {
        router.push("/auth/signin");
      }
    }
  }, [router, status]);

  if (status === "authenticated") return children;
  if (status === "unauthenticated" && router.pathname === "/auth/signin") return children;
}
