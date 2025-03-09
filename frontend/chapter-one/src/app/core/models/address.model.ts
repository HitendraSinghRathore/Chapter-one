export interface Address {
    id: number;
    contactName: string;    
    address: string;        
    latitude: number;      
    longitude: number;     
    primary: boolean;
    houseNo: string;        
    area: string;           
    landmark?: string;
    contactNumber?: string;
    instructions?: string;           
    createdAt?: Date;
    updatedAt?: Date;
  }
  