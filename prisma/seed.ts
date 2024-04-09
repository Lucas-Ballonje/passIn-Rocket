import { prisma } from "../src/lib/prisma"

async function seed() {
    await prisma.event.create({
        data:{
            id: "ebebef01-b6a9-4ca0-8276-0c05f074d97f",
            title: "Evento Teste",
            slug: "Evento Teste",
            details: "Uma descrição teste",
            maximumAttendees: 100
        }
    })
}

seed().then(() => {
    console.log("Database Seeded!");    
    prisma.$disconnect()
})