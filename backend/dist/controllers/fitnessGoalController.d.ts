import { Request, Response } from "express";
import "../types/express";
export declare const getGoals: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const upsertTargets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProgress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=fitnessGoalController.d.ts.map