export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PK: string;
      
    }
  }
}