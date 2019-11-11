export interface JiraSearchIssueResponse {
  sections: {
    label: string;
    sub: string;
    id: string;
    msg: string;
    issues: {
      id: number;
      key: string;
      keyHtml: string;
      img: string;
      summary: string;
      summaryText: string;
    }[];
  }[];
}
