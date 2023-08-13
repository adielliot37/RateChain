export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      UID: string;
     
    }
  }
}
