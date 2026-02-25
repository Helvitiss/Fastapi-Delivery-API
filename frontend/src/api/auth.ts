import api from './client';
import { OTPRequest, OTPSentResponse, OTPVerifyRequest, TokenResponse } from '../types';

export const authService = {
    requestCode: async (data: OTPRequest): Promise<OTPSentResponse> => {
        const response = await api.post<OTPSentResponse>('/auth/request-code', data);
        return response.data;
    },
    login: async (data: OTPVerifyRequest): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>('/auth/login', data);
        return response.data;
    },
};
