import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { courseValidationSchema } from 'validationSchema/courses';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.course
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCourseById();
    case 'PUT':
      return updateCourseById();
    case 'DELETE':
      return deleteCourseById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCourseById() {
    const data = await prisma.course.findFirst(convertQueryToPrismaUtil(req.query, 'course'));
    return res.status(200).json(data);
  }

  async function updateCourseById() {
    await courseValidationSchema.validate(req.body);
    const data = await prisma.course.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCourseById() {
    const data = await prisma.course.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
