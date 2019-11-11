export interface JiraCommentIssueRequest {
  body: {
    type: 'doc',
    version: 1,
    content: {
      type: 'paragraph';
      content: {
        text: string;
        type: 'text';
      }[]
    }[]
  };
}
