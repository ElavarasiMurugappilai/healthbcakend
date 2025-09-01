import { Request, Response } from "express";
export declare const getChatMessages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const suggestMedication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const respondToMedicationSuggestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPendingMedicationSuggestions: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=chatController.d.ts.map