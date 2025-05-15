// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';

let prismaInstance; // Zmieniona nazwa dla jasności

if (process.env.NODE_ENV === 'production') {
    prismaInstance = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prismaInstance = global.prisma;
}

export default prismaInstance;