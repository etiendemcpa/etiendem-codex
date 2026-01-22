import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Organization = {
  id: string;
  name?: string;
};

type OrgMember = {
  id: string;
  orgId: string;
};

type OrganizationContextValue = {
  currentOrg: Organization | null;
  currentMember: OrgMember | null;
  switchOrganization: (orgId: string) => Promise<void>;
};

type OrganizationProviderProps = {
  children: React.ReactNode;
  orgs: Organization[];
  loadOrgMember: (orgId: string) => Promise<OrgMember | null>;
  storageKey?: string;
  initialOrgId?: string;
};

const OrganizationContext = createContext<OrganizationContextValue | undefined>(
  undefined,
);

const DEFAULT_STORAGE_KEY = "selectedOrgId";

const readStoredOrgId = (storageKey: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
};

const writeStoredOrgId = (storageKey: string, orgId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, orgId);
  } catch {
    return;
  }
};

const resolveInitialOrgId = (
  orgs: Organization[],
  storageKey: string,
  initialOrgId?: string,
) => {
  const storedOrgId = readStoredOrgId(storageKey);
  const candidateIds = [storedOrgId, initialOrgId].filter(
    (value): value is string => Boolean(value),
  );
  const matchingOrg = orgs.find((org) => candidateIds.includes(org.id));
  return matchingOrg?.id ?? orgs[0]?.id ?? null;
};

export const OrganizationProvider = ({
  children,
  orgs,
  loadOrgMember,
  storageKey = DEFAULT_STORAGE_KEY,
  initialOrgId,
}: OrganizationProviderProps) => {
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(() =>
    resolveInitialOrgId(orgs, storageKey, initialOrgId),
  );
  const [currentMember, setCurrentMember] = useState<OrgMember | null>(null);

  useEffect(() => {
    if (!orgs.length) {
      setCurrentOrgId(null);
      return;
    }

    const hasOrg = currentOrgId
      ? orgs.some((org) => org.id === currentOrgId)
      : false;

    if (!hasOrg) {
      setCurrentOrgId(resolveInitialOrgId(orgs, storageKey, initialOrgId));
    }
  }, [currentOrgId, initialOrgId, orgs, storageKey]);

  useEffect(() => {
    let isActive = true;

    const loadMember = async () => {
      if (!currentOrgId) {
        setCurrentMember(null);
        return;
      }

      const member = await loadOrgMember(currentOrgId);
      if (isActive) {
        setCurrentMember(member);
      }
    };

    loadMember();

    return () => {
      isActive = false;
    };
  }, [currentOrgId, loadOrgMember]);

  const currentOrg = useMemo(() => {
    if (!currentOrgId) {
      return null;
    }

    return orgs.find((org) => org.id === currentOrgId) ?? null;
  }, [currentOrgId, orgs]);

  const switchOrganization = useCallback(
    async (orgId: string) => {
      if (orgId === currentOrgId) {
        return;
      }

      setCurrentOrgId(orgId);
      writeStoredOrgId(storageKey, orgId);
    },
    [currentOrgId, storageKey],
  );

  const value = useMemo(
    () => ({
      currentOrg,
      currentMember,
      switchOrganization,
    }),
    [currentMember, currentOrg, switchOrganization],
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }

  return context;
};

export type { OrgMember, Organization, OrganizationProviderProps };
