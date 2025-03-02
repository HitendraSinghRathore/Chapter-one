import { UserProfile } from "./user-profile.model";

export interface Address {
    id: number;
    contactName: string;
    address: string;
    primary: boolean;
    latitude: number;
    longitude: number;
    houseNo: string;
    area: string;
    landmark?: string;
    contactNumber?: string;
    instructions?: string;
    user: string;
}
export interface Order {
    id: number;
    user: UserProfile;
    address: Address;
    paymentMode: string;
    total: number;
    status: 'placed' | 'delivered';
    createdAt: Date;
    updatedAt: Date;
}