import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { moduleValidationSchema } from 'validationSchema/modules';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getModules();
    case 'POST':
      return createModule();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getModules() {
    const data = await prisma.module
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'module'));
    return res.status(200).json(data);
  }

  async function createModule() {
    await moduleValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.assessment?.length > 0) {
      const create_assessment = body.assessment;
      body.assessment = {
        create: create_assessment,
      };
    } else {
      delete body.assessment;
    }
    if (body?.assignment?.length > 0) {
      const create_assignment = body.assignment;
      body.assignment = {
        create: create_assignment,
      };
    } else {
      delete body.assignment;
    }
    if (body?.student_progress?.length > 0) {
      const create_student_progress = body.student_progress;
      body.student_progress = {
        create: create_student_progress,
      };
    } else {
      delete body.student_progress;
    }
    const data = await prisma.module.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
