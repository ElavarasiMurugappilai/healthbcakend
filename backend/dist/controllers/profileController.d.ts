import { Request, Response } from "express";
export declare function upsertQuiz(req: Request & {
    user?: {
        id: string;
    };
}, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMyProfile(req: Request & {
    user?: {
        id: string;
    };
}, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=profileController.d.ts.map