/**
 * This represent a Jira issue.
 */
export interface ErrorNormalized {

  /**
  * Each error must have a single id. A way to identify that the occurrence
  * has already been registered.
  * It is better that errors are not registred because there is a very embracing
  * id than to create a too generic id and end up making the software to register
  * too many defects, being all the same defect.
  * The id will be a label in Jira and it will be used by the library in JQL searchs.
  */
  id: string;

  /**
   * Summary in Jira
   */

  title: string;

  /**
   * Description in Jira
   */

  content: string;

  /**
   * Aditional labels
   */
  labels: string[];
}
