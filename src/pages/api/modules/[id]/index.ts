import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { moduleValidationSchema } from 'validationSchema/modules';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.module
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getModuleById();
    case 'PUT':
      return updateModuleById();
    case 'DELETE':
      return deleteModuleById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getModuleById() {
    const data = await prisma.module.findFirst(convertQueryToPrismaUtil(req.query, 'module'));
    return res.status(200).json(data);
  }

  async function updateModuleById() {
    await moduleValidationSchema.validate(req.body);
    const data = await prisma.module.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteModuleById() {
    const data = await prisma.module.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
