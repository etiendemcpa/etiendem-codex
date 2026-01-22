export type CurrentUser = {
  id: string;
  email: string;
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const userId = process.env.NEXT_PUBLIC_TEST_USER_ID;
  const email = process.env.NEXT_PUBLIC_TEST_USER_EMAIL;

  if (!userId || !email) {
    return null;
  }

  return { id: userId, email };
};
