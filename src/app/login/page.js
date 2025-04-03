"use client";

import { signIn, useSession, signOut } from "next-auth/react";

export default function LoginPage() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>Zalogowany jako {session.user?.email} ({session.user?.role})</p>
                <button onClick={() => signOut()}>Wyloguj</button>
            </div>
        );
    }

    return <button onClick={() => signIn("credentials")}>Zaloguj</button>;
}
