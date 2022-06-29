export interface LinkExchangeResponse {
  accessToken: string;
  expiresIn: number;
}

export interface FlexpaConfig {
  publishableKey: string;
  onSuccess: (publicToken: string) => Promise | unknown;
}


