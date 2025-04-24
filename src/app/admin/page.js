"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session.user.role !== "ADMIN") {
            router.push("/");
        }
    }, [session, status]);

    if (status === "loading") return <p>Ładowanie...</p>;
    if (!session) return <p>Nie masz dostępu</p>;

    return <h1>Panel administratora</h1>;
}
