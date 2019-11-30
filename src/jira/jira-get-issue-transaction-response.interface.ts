export interface JiraGetIssueTransactionResponse {
  transitions: {
    id: string,
    name: string,
    to: {
      description: string;
      iconUrl: string;
      name: string;
      id: string;
    },
    hasScreen: boolean,
    isGlobal: boolean,
    isInitial: boolean,
    isConditional: boolean
  }[];
}
