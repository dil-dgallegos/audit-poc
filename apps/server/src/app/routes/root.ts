import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Client } from '@audit/interfaces';

export default async function (fastify: FastifyInstance) {
  const cliente: Client = {
    first_name: 'as',
    last_name: 'as',
    age: 2,
  };

  fastify.get('/', async function (request: FastifyRequest, reply: FastifyReply) {
    return { message: 'Hello API' };
  });
}
