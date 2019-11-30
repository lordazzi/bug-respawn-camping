export interface JiraCreateIssueResponse {
  id: string;
  key: string;
  transition: {
    status: number;
    errorCollection: {
      errorMessages: string[]
    };
  };
}
