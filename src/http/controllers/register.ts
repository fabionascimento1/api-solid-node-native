import { FastifyReply, FastifyRequest } from "fastify";

export function register(request: FastifyRequest, reply: FastifyReply) {
  reply.status(201).send();
}
