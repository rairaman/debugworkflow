import {
  onPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "nonPersistentSessionWorkflow",
  name: "Non Persistent Session Workflow",
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.accessToken": {},
    "kinde.ssoSession": {},
    "kinde.env": {},
  },
  failurePolicy: { action: "stop" }
};

// The workflow code to be executed when the event is triggered
export default async function Workflow(event: onPostAuthenticationEvent) {
  let policy = "persistent"

  const nonPersistentConnectionIDs = getEnvironmentVariable(
    "NON_PERSISTENT_SESSION_CONNECTION_IDS"
  ).value.split(",");
  
  console.log("nonPersistentConnectionIDs:", nonPersistentConnectionIDs)

  kinde.ssoSession.setPolicy(policy)
  // check if the connection id is in the non persistent connection ids
  if (nonPersistentConnectionIDs.includes(event.context.auth.connectionId)) {
    kinde.ssoSession.setPolicy("non_persistent");
    console.log("setting sso session policy to non_persistent")
  }

  let accessToken = c();
  (accessToken.isDeployed = !0), (accessToken.ksp = policy);
}

function c() {
  if (!kinde.accessToken)
    throw new Error(
      "accessToken binding not available, please add to workflow/page settings to enable"
    );
  let e2 = kinde.accessToken.getCustomClaims();
  return new Proxy(e2, r);
}

