import {
  onUserTokenGeneratedEvent,
  WorkflowSettings,
  WorkflowTrigger,
  accessTokenCustomClaims,
  getEnvironmentVariable,
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
    console.log("setting sso session policy to non_persistent");
    policy = "non_persistent";
  }

  const accessToken = accessTokenCustomClaims<{
    isDeployed: boolean;
  }>();
  accessToken.isDeployed = true;
  accessToken.ksp = policy;
}


