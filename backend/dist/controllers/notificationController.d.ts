import { Request, Response } from 'express';
type AuthRequest = Request;
export declare const getNotifications: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createNotification: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAsRead: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAllAsRead: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteNotification: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getNotificationStats: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSystemNotification: (userId: string, title: string, message: string, options?: {
    type?: "medication" | "appointment" | "challenge" | "measurement" | "system" | "fitness" | "general";
    priority?: "low" | "medium" | "high" | "urgent";
    actionUrl?: string;
    actionText?: string;
    metadata?: Record<string, any>;
}) => Promise<import("mongoose").Document<unknown, {}, import("../models/Notification").INotification> & import("../models/Notification").INotification & {
    _id: import("mongoose").Types.ObjectId;
}>;
export {};
//# sourceMappingURL=notificationController.d.ts.map