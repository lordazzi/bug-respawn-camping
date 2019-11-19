export interface JiraCommentIssueRequest {
  body: {
    type: 'doc';
    version: 1;
    content: {
      type: 'paragraph' | string;
      content: {
        text: string;
        type: 'text' | string;
      }[]
    }[]
  };
}
