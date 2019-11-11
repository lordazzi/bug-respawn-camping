export interface JiraCreateIssueRequest {
  fields: {
    summary: string;
    issuetype: { name: 'Bug' };
    description: string;
    labels: string[];
    project: {
      key: string;
    };
  };
}
