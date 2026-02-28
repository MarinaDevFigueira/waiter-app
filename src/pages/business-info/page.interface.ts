export interface BusinessAddress {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface BusinessInfo {
  name: string;
  logoUrl: string;
  address: BusinessAddress;
}
