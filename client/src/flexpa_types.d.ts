export interface LinkExchangeResponse {
  accessToken: string;
  expiresIn: number;
}

export interface FlexpaConfig {
  publishableKey: string;
  user: {
    externalId: string;
  };
  onSuccess: (publicToken: string) => Promise | unknown;
}
