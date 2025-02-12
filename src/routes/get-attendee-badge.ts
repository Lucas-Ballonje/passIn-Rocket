import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadResquest } from "./_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/badge", {
        schema: {
            summary: "Cria um badge(crachá) para o participante",
            tags: ["attendees"],
            params: z.object({
                attendeeId: z.coerce.number().int(),
            }),
            response: {
               200: z.object({
                    badge: z.object({
                        name: z.string(),
                        email: z.string().email(),
                        eventTitle: z.string(),
                        checkInUrl: z.string().url(),
                    })
               })
            }
        }  
    }, async (req, reply) => {
        const { attendeeId } = req.params;

        const attendee = await prisma.attendee.findUnique({
            select: {
                name: true,
                email: true,
                event: {
                    select: {
                        title: true
                    }
                }
            },
            where: {
                id: attendeeId
            }
        })

        if(attendee === null){
            throw new BadResquest ("Attendee not found.")
        }

        const baseURL = `${req.protocol}://${req.hostname}`;                

        const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

        return reply.send({ 
            badge: {
                name: attendee.name,
                email: attendee.email, 
                eventTitle: attendee.event.title,
                checkInUrl: checkInUrl.toString(),                
            }
         })
    })
}