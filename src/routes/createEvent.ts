import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/genarete-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadResquest } from "./_errors/bad-request";


export async function createEvent(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/events", {
            schema: {
                summary: "Cria um evento",
                tags: ["events"],
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid()
                    })
                },
            }
        } ,async (req, reply) => {        

            const { title, details, maximumAttendees } = req.body;

            const slug = generateSlug(title)

            const eventWithSameSlug = await prisma.event.findUnique({
                where: {
                    slug
                }
            })

            if(eventWithSameSlug !== null){
                throw new BadResquest ("Another event with same title already exists")
            }
            
            const event = await prisma.event.create({
                data: {
                    title: title,
                    details: details,
                    maximumAttendees: maximumAttendees,
                    slug,
                }
            })

            // return { eventId: event.id }
            return reply.status(201).send({ eventId: event.id })
    })
}