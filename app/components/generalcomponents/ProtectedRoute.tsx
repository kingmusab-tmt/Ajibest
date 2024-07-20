"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[];
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (session && roles && !roles.includes(`${session?.user?.role}`)) {
      router.push("/unauthorized"); // Redirect if user doesn't have the required role
    }
  }, [session, status, router, roles]);

  if (status === "loading" || !session) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
