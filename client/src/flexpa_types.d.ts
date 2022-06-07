// // Let Typescript know about the FlexpaLink object from the link script TODO - this doesn't export properly??
// export declare const FlexpaLink: {
//     create: (config: FlexpaConfig) => {},
//     open: () => {}
// };

export interface LinkExchangeResponse {
    accessToken: string;
    patientId: string;
    expiresIn: number;
}

export interface FlexpaConfig {
    publishableKey: string;
    onSuccess: (publicToken: string) => {};
}


