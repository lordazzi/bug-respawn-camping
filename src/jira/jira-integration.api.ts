export class JiraIntegrationApi {
  private static instance: JiraIntegrationApi | null = null;

  constructor() {
    if (!JiraIntegrationApi.instance) {
      JiraIntegrationApi.instance = this;
    }

    return JiraIntegrationApi.instance;
  }

  createIssue() {

  }

  findIssueByLabel() {

  }

  commentIssue() {

  }

  getAllRegistredBug() {

  }
}
