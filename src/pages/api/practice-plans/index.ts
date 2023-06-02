import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { practicePlanValidationSchema } from 'validationSchema/practice-plans';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPracticePlans();
    case 'POST':
      return createPracticePlan();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPracticePlans() {
    const data = await prisma.practice_plan
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'practice_plan'));
    return res.status(200).json(data);
  }

  async function createPracticePlan() {
    await practicePlanValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.attendance?.length > 0) {
      const create_attendance = body.attendance;
      body.attendance = {
        create: create_attendance,
      };
    } else {
      delete body.attendance;
    }
    if (body?.performance?.length > 0) {
      const create_performance = body.performance;
      body.performance = {
        create: create_performance,
      };
    } else {
      delete body.performance;
    }
    const data = await prisma.practice_plan.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
