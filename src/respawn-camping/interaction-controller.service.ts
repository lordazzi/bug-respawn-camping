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
    const comment = issue.fields.comment.comments.pop();

    if (comment) {
      const configuredEarly = new Date().getTime() - this.environment.waitTimeConfig.betweenEachInteractionOnTheSameIssue;
      const isTooEarlyToComment = new Date(comment.updated) > new Date(configuredEarly);

      if (isTooEarlyToComment) {
        return false;
      }
    }

    if (issue.fields.comment.total <= this.environment.maxCommentsInIssue) {
      return true;
    }

    return false;
  }
}
