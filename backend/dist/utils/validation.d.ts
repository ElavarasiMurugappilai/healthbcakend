import { ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
export declare const registerValidation: ValidationChain[];
export declare const loginValidation: ValidationChain[];
export declare const measurementValidation: ValidationChain[];
export declare const profileValidation: ValidationChain[];
export declare const bloodPressureValidation: (req: Request, res: Response, next: NextFunction) => void;
export declare const sanitizeQuizPayload: (payload: any) => any;
//# sourceMappingURL=validation.d.ts.map