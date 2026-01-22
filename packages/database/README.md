# Firebase Setup (Next.js App Router)

## Environment Variables

Client (browser) variables (exposed to the client via `NEXT_PUBLIC_`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

Server/admin variables (kept private on the server):

```env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
```

If your environment provides default credentials (e.g., GCP runtime), you can omit
`FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` and rely on application default
credentials.

## Initialization Best Practices (App Router)

- **Client SDK**: import `firebaseClient.ts` only in Client Components or hooks that
  run in the browser. The module guards browser-only persistence setup behind a
  `typeof window` check.
- **Admin SDK**: import `firebaseAdmin.ts` only in Server Actions, Route Handlers,
  or other server-only modules.
- **Singleton initialization**: both files use a singleton pattern (`getApps()` or
  `admin.apps.length`) to prevent re-initialization during HMR or in edge/serverless
  environments.
- **Private key formatting**: keep the private key in an environment variable with
  escaped newlines (`\\n`), which is converted back to newlines at runtime.
