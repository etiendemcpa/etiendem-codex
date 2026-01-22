import { useEffect, useState } from "react";
import { Firestore } from "firebase/firestore";

import {
  fetchUserOrganizations,
  Organization,
} from "../firestore/organizations";

type PortalDashboardProps = {
  db: Firestore;
  userId: string;
};

export const PortalDashboard = ({ db, userId }: PortalDashboardProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadOrganizations = async () => {
      setIsLoading(true);
      const orgs = await fetchUserOrganizations(db, userId);

      if (isActive) {
        setOrganizations(orgs);
        setIsLoading(false);
      }
    };

    if (userId) {
      void loadOrganizations();
    } else {
      setOrganizations([]);
      setIsLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [db, userId]);

  if (isLoading) {
    return <div>Loading organizations...</div>;
  }

  if (!organizations.length) {
    return <div>No organizations found.</div>;
  }

  return (
    <section>
      <h2>Your organizations</h2>
      <ul>
        {organizations.map((organization) => (
          <li key={organization.id}>{organization.name ?? organization.id}</li>
        ))}
      </ul>
    </section>
  );
};
