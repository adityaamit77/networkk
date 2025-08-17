import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export async function requireAuth<T>(
  context: GetServerSidePropsContext,
  callback: () => Promise<GetServerSidePropsResult<T>>
): Promise<GetServerSidePropsResult<T>> {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } } as const;
  }
  return callback();
}

