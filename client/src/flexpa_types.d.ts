export interface LinkExchangeResponse {
  accessToken: string;
  expiresIn: number;
}

export interface FlexpaConfig {
  publishableKey: string;
  user: {
    externalId: string;
  };
  usage: 'ONE_TIME';
  onSuccess: (publicToken: string) => Promise | unknown;
}
