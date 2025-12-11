export type JwtPayload = {
   id: string;
   email: string;
   name?: string;
   otp?: string;
   individualAccountId?: string;
   corporateAccountId?: string;
   isMissingOnboarding?: boolean;
   tokenCount?: number;
   plan?: string;
};

export type TokenResponse = {
   token: string;
   expiresIn: string;
};

export type VerifyTokenResponse = {
   isValid: boolean;
   payload?: JwtPayload;
   error?: string;
};

export interface JwtTokenService {
   generate(payload: JwtPayload, expiresIn?: string): Promise<TokenResponse>;
   verify(token: string): Promise<VerifyTokenResponse>;
   decode(token: string): JwtPayload | null;
}