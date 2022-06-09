export interface LinkExchangeResponse {
    accessToken: string;
    patientId: string;
    expiresIn: number;
}

export interface FlexpaConfig {
    publishableKey: string;
    onSuccess: (publicToken: string) => {};
}


