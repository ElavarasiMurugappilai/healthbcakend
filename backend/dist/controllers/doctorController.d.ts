import { Request, Response } from "express";
export declare const getSystemDoctors: (req: Request, res: Response) => Promise<void>;
export declare const addToCareTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCareTeam: (req: Request, res: Response) => Promise<void>;
export declare const getSuggestedDoctors: (req: Request, res: Response) => Promise<void>;
export declare const respondToSuggestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createDoctorSuggestions: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=doctorController.d.ts.map