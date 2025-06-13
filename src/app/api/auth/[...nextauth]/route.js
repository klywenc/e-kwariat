import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) throw new Error("Nie znaleziono użytkownika");

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) throw new Error("Nieprawidłowe hasło");

                return { id: user.id, name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Przy pierwszym logowaniu, dodajemy ID i rolę do tokenu
            if (user) {
                token.id = user.id; // <-- DODAJ TĘ LINIĘ
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            // W każdej sesji, dodajemy ID i rolę z tokenu do obiektu session.user
            if (token && session.user) {
                session.user.id = token.id; // <-- DODAJ TĘ LINIĘ
                session.user.role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
