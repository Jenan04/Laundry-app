export interface User {
    id: string;
    full_name: string;
    email: string;


}
export interface GoogleProfile {
  sub: string;
  email: string;
  
}

export interface GoogleUser {
  email: string ;
  name: string;
}

export interface GoogleArgs {
  profile: GoogleProfile;
  user: GoogleUser;
}
export interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}

export interface LimbProps {
  position: [number, number, number];
  rotation?: [number, number, number]; 
  isArm?: boolean;
}

export interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  };
  expires: string;
}

export interface MyContext {
  userId?: string;
  session?: {
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  };
}