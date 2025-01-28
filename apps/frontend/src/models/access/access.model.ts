
export interface CreateShareLinkRequest {
    visibility: string; 
    permissions: string; 
    expiryDate?: string; 
  }
  
  export interface CreateShareLinkResponse {
    linkToken: string;
    url: string;
    expiryDate?: string;
  }
  
  export interface AddAccessRequest {
    email: string;
    permissionLevel: string; 
    expiryDate?: string; 
  }
  
  export interface Access {
    id: string;
    email: string;
    permissionLevel: string;
    expiryDate?: string;
  }
  
  export interface AccessListResponse {
    accesses: Access[];
}
  
export interface GetShareLinkTokenResponse {
  linkToken: string;
}