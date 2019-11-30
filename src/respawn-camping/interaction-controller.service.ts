import { JiraGetIssueResponse } from '../jira/jira-get-issue-response.interface';
import { EnvironmentService } from './../environment.service';

export class InteractionControllerService {

  private static instance: InteractionControllerService | null = null;

  private environment = new EnvironmentService();

  constructor() {
    if (!InteractionControllerService.instance) {
      InteractionControllerService.instance = this;
    }

    return InteractionControllerService.instance;
  }

  canInteract(): boolean {
    return true;
  }

  shouldComment(issue: JiraGetIssueResponse): boolean {
    if (issue.fields.comment.length <= this.environment.maxCommentsInIssue) {
      return true;
    }

    return false;
  }
}
