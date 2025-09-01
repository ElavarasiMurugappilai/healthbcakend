import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
export declare const suggestMedication: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateMedicationStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserMedications: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPendingMedications: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=medicationController.d.ts.map