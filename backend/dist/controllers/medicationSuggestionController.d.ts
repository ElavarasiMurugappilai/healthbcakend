import { Request, Response } from "express";
export declare const suggestMedication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMedicationSuggestions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const acceptMedicationSuggestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMedicationSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=medicationSuggestionController.d.ts.map