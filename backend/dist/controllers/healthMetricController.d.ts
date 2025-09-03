import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getHealthMetrics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addHealthMetric: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getHealthTrends: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getLatestMetrics: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateHealthMetric: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteHealthMetric: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getHealthInsights: (req: AuthRequest, res: Response) => Promise<void>;
export declare const markInsightAsRead: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=healthMetricController.d.ts.map