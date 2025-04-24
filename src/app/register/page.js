"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        setMessage(data.message);
        if (res.ok) router.push("/login");
    };

    return (
        <div>
            <h2>Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Imię" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input type="password" placeholder="Hasło" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="submit">Zarejestruj</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
