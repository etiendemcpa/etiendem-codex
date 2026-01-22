import { redirect } from "next/navigation";

import { getCurrentUser } from "../../../lib/auth/getCurrentUser";
import { createOrganizationForUser } from "../../../lib/orgs/createOrganization";

export const CreateOrganizationForm = () => {
  const createOrganizationAction = async (formData: FormData) => {
    "use server";

    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User must be signed in to create an organization.");
    }

    const name = formData.get("name");
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Organization name is required.");
    }

    const { orgId } = await createOrganizationForUser({
      name: name.trim(),
      userId: user.id,
    });

    redirect(`/organizations/${orgId}`);
  };

  return (
    <form action={createOrganizationAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="name">
          Organization name
        </label>
        <input
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          id="name"
          name="name"
          placeholder="Acme, Inc."
          required
          type="text"
        />
      </div>
      <button
        className="inline-flex items-center rounded bg-black px-4 py-2 text-white"
        type="submit"
      >
        Create Organization
      </button>
    </form>
  );
};
