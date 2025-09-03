import { Request, Response } from 'express';
type AuthRequest = Request;
export declare const getChallenges: (req: AuthRequest, res: Response) => Promise<void>;
export declare const joinChallenge: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateChallengeProgress: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserChallenges: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const leaveChallenge: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getChallengeStats: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLeaderboard: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=challengeController.d.ts.map