import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { performanceValidationSchema } from 'validationSchema/performances';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPerformances();
    case 'POST':
      return createPerformance();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPerformances() {
    const data = await prisma.performance
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'performance'));
    return res.status(200).json(data);
  }

  async function createPerformance() {
    await performanceValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.performance.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
