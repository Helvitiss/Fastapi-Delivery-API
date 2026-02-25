import { JWTPayload } from "../types";

export function decodeJWT(token: string): JWTPayload | null {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(
            atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        );

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            return null;
        }

        return decoded as JWTPayload;
    } catch (error) {
        return null;
    }
}

export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    const payload = decodeJWT(token);
    return payload !== null && payload.exp * 1000 > Date.now();
}
