// Temporary in-memory storage for automation agents
// In production, replace with database models

export const linkedInPosts: any[] = [];
export const blogPosts: any[] = [];
export let linkedInAgentEnabled = false;

export function setLinkedInAgentEnabled(enabled: boolean) {
  linkedInAgentEnabled = enabled;
}

export function getLinkedInAgentEnabled() {
  return linkedInAgentEnabled;
}

