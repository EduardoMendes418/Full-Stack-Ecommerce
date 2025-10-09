import { AuthObject } from "@clerk/express";
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthObject; 
  }
}
