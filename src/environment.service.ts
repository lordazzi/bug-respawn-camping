export class EnvironmentService {

  private static instance: EnvironmentService | null = null;

  basicAuth: string | null = null;
  atlassianJiraServer: string | null = null;

  /**
   * Project key
   */
  defaultProjectKey = '';
  maxCommentsInIssue = 30;

  /**
   * Name of issue type of bug in your Jira
   */
  bugTypeName = 'Bug';

  /**
   * Block integration if version change
   */
  jiraVersion = 3;

  waitTimeConfig: {
    betweenEachInteractionOnTheSameIssue: number;
    lowNetworkWhileUserIsActive: number;
  } = {
      /**
       * Interact only one time with each issue in a time interval
       */
      betweenEachInteractionOnTheSameIssue: 7200000, // 2 * 20 * 20 * 1000, 2hrs

      /**
       * Stop interacting with Jira when user is active and haven't
       * much network speed
       */
      lowNetworkWhileUserIsActive: 7200000, // 2 * 20 * 20 * 1000, 2hrs
    };

  stopInteractWhen: {
    criticalDays: {
      day: number;
      month: number;
    }[][];
    maximumAmountOfIssuesReached: number | false;
  } = {

      /**
       * Stop interacting with jira in critical day
       */
      criticalDays: [
        [{ day: 25, month: 4 }, { day: 15, month: 5 }],
        [{ day: 15, month: 11 }, { day: 1, month: 12 }],
        [{ day: 15, month: 12 }, { day: 20, month: 1 }]
      ],

      maximumAmountOfIssuesReached: 30
    };

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
