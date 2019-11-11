export class EnvironmentService {

  private static instance: EnvironmentService | null = null;

  basicAuth: string | null = null;
  atlassianJiraServer: string | null = null;
  defaultProjectKey: string | null = null;

  /**
   * Whether the project in which the issue is created is added to the
   * user's Recently viewed project list, as shown under Projects in Jira.
   */
  updateJiraHistory = false;

  constructor() {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = this;
    }

    return EnvironmentService.instance;
  }
}
