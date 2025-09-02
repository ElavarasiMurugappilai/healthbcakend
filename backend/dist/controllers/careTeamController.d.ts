import { Request, Response } from "express";
export declare const getSuggestedDoctors: (req: Request, res: Response) => Promise<void>;
export declare const addDoctorToCareTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyCareTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=careTeamController.d.ts.map