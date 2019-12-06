export class EnvironmentService {

  private static instance: EnvironmentService | null = null;

  readonly SOFTWARE_IDENTIFIER = 'catch-by-respawn-camping';

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
   * TODO:
   *
   * The backlog or todo transaction id.
   * If this id is given, the library will not execute an aditional endpoint to find out
   * the initial transaction of each issue each time it is registered.
   */
  initialTransactionId: string | null = null;

  /**
   * Block integration if version change
   */
  jiraVersion = 2;

  /**
   * Allow you to include software information
   * for all registred issue
   */
  aditionalInformation = '';

  waitTimeConfig: {
    betweenEachInteractionOnTheSameIssue: number;
    lowNetworkWhileUserIsActive: number;
  } = {
      /**
       * Interact only one time with each issue in a time interval
       */
      betweenEachInteractionOnTheSameIssue: 7200000, // 2 * 20 * 20 * 1000, 2hrs

      /**
       * TODO:
       * Stop interacting with Jira when user is active and haven't
       * much network speed
       */
      lowNetworkWhileUserIsActive: 7200000, // 2 * 20 * 20 * 1000, 2hrs
    };

  /**
   * Configurations about when the software should stop interacting with jira
   */
  stopInteractWhen: {
    maximumAmountOfIssuesReached: number | false;
  } = {

      /**
       * if it reach this number of registered issues
       */
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
