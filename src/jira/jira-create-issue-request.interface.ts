export interface JiraCreateIssueRequest {
  fields: {
    summary: string;
    issuetype: { name: 'Bug' | 'Problema' | string };
    description: string;
    labels: string[];
    project: {
      key: string;
    };
  };
}
