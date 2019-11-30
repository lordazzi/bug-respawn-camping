export interface JiraSearchIssueResponse {
  expand: string;
  maxResults: number;
  startAt: number;
  total: number;
  issues: {
    expand: string;
    id: string;
    key: string;
    self: string;
    fields: {
      summary: string;
      issuetype: {
        id: string;
        avatarId: number;
        description: string;
        iconUrl: string;
        name: string | 'Bug';
        self: string;
        subtask: boolean;
      };
    }[];
  }[];
}
