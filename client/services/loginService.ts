import { _post } from "../client";
import { AdminLoginDto } from "../types/dto/admin-login.type";

const loginAdmin = async (loginData: AdminLoginDto) => {
  const response = await _post<unknown, AdminLoginDto>(
    "/api/auth/login/admin",
    loginData
  );
  return response.data;
};

export { loginAdmin };
