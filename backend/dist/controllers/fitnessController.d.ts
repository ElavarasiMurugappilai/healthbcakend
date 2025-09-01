import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: any;
}
export declare const createFitnessGoals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFitnessGoals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logFitnessActivity: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateFitnessProgress: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=fitnessController.d.ts.map