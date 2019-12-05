export interface JiraGetIssueResponse {
  id: string;
  self: string;
  key: string;
  fields: {
    comment: {
      maxResults: number;
      startAt: number;
      total: number;
      comments: {
        self: string;
        id: string;
        author: {
          active: boolean;
          avatarUrls: {
            [imageSize: string]: string | undefined
          };
          displayName: string;
          emailAddress: string;
          key: string;
          name: string;
          self: string;
          timeZone: string;
        };
        body: string;
        updateAuthor: {
          active: boolean;
          avatarUrls: {
            [imageSize: string]: string | undefined
          };
          displayName: string;
          emailAddress: string;
          key: string;
          name: string;
          self: string;
          timeZone: string;
        };
        created: string;
        updated: string;
      }[];
    };
  };
}
