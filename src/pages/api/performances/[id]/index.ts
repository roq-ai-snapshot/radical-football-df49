import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { performanceValidationSchema } from 'validationSchema/performances';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.performance
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPerformanceById();
    case 'PUT':
      return updatePerformanceById();
    case 'DELETE':
      return deletePerformanceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPerformanceById() {
    const data = await prisma.performance.findFirst(convertQueryToPrismaUtil(req.query, 'performance'));
    return res.status(200).json(data);
  }

  async function updatePerformanceById() {
    await performanceValidationSchema.validate(req.body);
    const data = await prisma.performance.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deletePerformanceById() {
    const data = await prisma.performance.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
