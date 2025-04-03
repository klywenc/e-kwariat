import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return new Response(JSON.stringify({ message: "Wszystkie pola są wymagane" }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return new Response(JSON.stringify({ message: "Użytkownik już istnieje" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "USER" },
    });

    return new Response(JSON.stringify({ message: "Rejestracja udana", user }), { status: 201 });
}
