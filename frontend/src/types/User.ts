export interface ExtendedUser {
    id: number;
    auth0ID: string;
    name: string;
    email: string;
    profilePicture: string;
    role: string;
    verified: boolean;
    lastLogin: Date;
    bio?: string;
    experience?: number;
    specialties?: string[];
    location?: string;
}