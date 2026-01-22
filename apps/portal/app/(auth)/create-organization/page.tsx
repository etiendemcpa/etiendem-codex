import { CreateOrganizationForm } from "./CreateOrganizationForm";

const CreateOrganizationPage = () => (
  <div className="mx-auto max-w-lg space-y-6 py-12">
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Create Organization</h1>
      <p className="text-gray-600">You are not part of any organizations yet.</p>
    </div>
    <CreateOrganizationForm />
  </div>
);

export default CreateOrganizationPage;
