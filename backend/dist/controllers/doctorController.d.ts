import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
export declare const getSystemDoctors: (req: Request, res: Response) => Promise<void>;
export declare const addToCareTeam: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCareTeam: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=doctorController.d.ts.map