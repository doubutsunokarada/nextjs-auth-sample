import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  LiteralUnion,
  useSession,
} from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import SignIn from "../pages/auth/signin";

export default function AuthenticationMiddleware({
  children,
  providers,
  loginError,
}: {
  children: React.ReactElement;
  providers: Promise<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>;
  loginError: string;
}): any {
  const { status } = useSession();
  const router = useRouter();
  React.useEffect(() => {
    if (status === "unauthenticated") {
      if (router.pathname !== "/auth/signin") {
        router.push("/auth/signin");
      }
    }
  }, [router, status]);
  if (status === "unauthenticated") {
    return <SignIn providers={providers} loginError={loginError} />;
  } else if (status === "loading") {
    return <p>Loading ...</p>;
  } else {
    if (children.type === SignIn) {
      router.replace("/");
    }
    return children;
  }
}
