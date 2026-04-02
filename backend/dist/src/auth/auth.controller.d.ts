import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            nome: any;
            email: any;
            role: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            nome: any;
            email: any;
            role: any;
        };
    }>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        nome: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
}
