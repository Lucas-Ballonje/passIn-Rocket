import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadResquest } from "./_errors/bad-request";


export async function getEvent(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events/:eventId", {    
        schema: {
            summary: "Obter evento",
            tags: ["events"],
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    event: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        slug: z.string(),
                        details: z.string().nullable(),
                        maximumAttendees: z.number().int().nullable(),
                        attendeesAmount: z.number().int(),
                    })
                })
            },
        }
    }, async (req, reply) => {
        const { eventId } = req.params

        const event = await prisma.event.findUnique({
            select: {
                id: true,
                title: true,
                slug: true,
                details: true,
                maximumAttendees: true,
                _count: {
                    select: {
                        Attendees: true,
                    },
                },
            },
            where: {
                id: eventId,
            }
        })

        if(event === null){
            throw new BadResquest ("Event not found")
        }

        return reply.send({ 
            event: {
                id: event.id,
                title: event.title,
                slug: event.slug,
                details: event.details,
                maximumAttendees: event.maximumAttendees,
                attendeesAmount: event._count.Attendees,
            }
         })
    })
}