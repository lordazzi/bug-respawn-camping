export interface JiraGetIssueResponse {
  id: string;
  self: string;
  key: string;
  fields: {
    comment: {
      self: string;
      id: string;
      author: {
        self: string;
        accountId: string;
        displayName: string;
        active: boolean;
      };
      body: {
        type: string;
        version: number;
        content: {
          type: string;
          content: {
            type: string;
            text: string;
          }[];
        }[];
      },
      updateAuthor: {
        self: string;
        accountId: string;
        displayName: string;
        active: boolean;
      },
      created: string;
      updated: string;
      visibility: {
        type: string;
        value: string;
      }
    }[];
  };
}
