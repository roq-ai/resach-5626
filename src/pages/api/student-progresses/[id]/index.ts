import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { studentProgressValidationSchema } from 'validationSchema/student-progresses';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.student_progress
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getStudentProgressById();
    case 'PUT':
      return updateStudentProgressById();
    case 'DELETE':
      return deleteStudentProgressById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStudentProgressById() {
    const data = await prisma.student_progress.findFirst(convertQueryToPrismaUtil(req.query, 'student_progress'));
    return res.status(200).json(data);
  }

  async function updateStudentProgressById() {
    await studentProgressValidationSchema.validate(req.body);
    const data = await prisma.student_progress.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteStudentProgressById() {
    const data = await prisma.student_progress.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
