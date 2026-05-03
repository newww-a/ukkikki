import { publicRequest } from "./customAxios";

export const login = async (email, password, isCompany) => {
  const endpoint = isCompany ? '/auth/companies/login' : '/auth/members/login';

  try {
    const response = await publicRequest.post(endpoint, { email, password });

    return response.data; // { status, message, data }
  } catch (error) {
    throw error.response?.data || { message: '로그인 실패' };
  }
};
