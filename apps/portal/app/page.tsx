import Link from "next/link";

import { getCurrentUser } from "../lib/auth/getCurrentUser";
import { getUserOrganizations } from "../lib/orgs/getUserOrganizations";

const HomePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-2 text-gray-600">Please sign in to continue.</p>
      </div>
    );
  }

  const organizations = await getUserOrganizations(user.id);

  if (organizations.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-12">
        <h1 className="text-2xl font-semibold">Create Organization</h1>
        <p className="text-gray-600">
          You are not part of any organizations yet. Create one to get started.
        </p>
        <Link
          className="inline-flex items-center rounded bg-black px-4 py-2 text-white"
          href="/create-organization"
        >
          Create Organization
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 py-12">
      <h1 className="text-2xl font-semibold">Your organizations</h1>
      <ul className="space-y-2">
        {organizations.map((org) => (
          <li key={org.id} className="rounded border border-gray-200 p-4">
            <p className="text-lg font-medium">{org.name}</p>
            <Link className="text-sm text-blue-600" href={`/organizations/${org.id}`}>
              View organization
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
