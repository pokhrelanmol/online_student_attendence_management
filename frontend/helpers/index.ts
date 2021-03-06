import { rejects } from "assert";
import axios, { AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
export interface IPayload {
    payload: {
        role: string;
        aud: string;
        name: string;
    };
}
export const joinClasses = (...classes: string[]) => {
    return classes.join(" ");
};
interface ITokens {
    accessToken: string;
    refreshToken: string;
}
export const setTokens = (tokens: ITokens) => {
    localStorage.setItem("tokens", JSON.stringify(tokens));
    return;
};

export const sendAccessToken = async (
    endPoint: string,
    method: string,
    data?: any
) => {
    return new Promise(async (resolve, reject) => {
        let res: AxiosResponse<any, any>;
        try {
            const tokens: any = JSON.parse(localStorage.getItem("tokens"));
            if (!tokens) {
                reject("No tokens");
            }

            if (method === "get") {
                res = await axios.get(endPoint, {
                    headers: {
                        Authorization: `Bearer ${tokens.accessToken}`,
                    },
                });
            } else if (method === "post") {
                console.log(data);
                res = await axios.post(endPoint, data, {
                    headers: {
                        Authorization: `Bearer ${tokens.accessToken}`,
                    },
                });
            } else if (method === "patch") {
                res = await axios.patch(endPoint, {
                    data,
                    headers: {
                        Authorization: `Bearer ${tokens.accessToken}`,
                    },
                });
            }

            const payload: IPayload = jwt.decode(tokens.accessToken);
            resolve({ payload, data: res });
        } catch (err) {
            if (
                err.message ===
                "Cannot read properties of null (reading 'accessToken')"
            ) {
                reject();
            } else if (err.response.data.error.message === "jwt expired") {
                const generateRefreshToken = async () => {
                    const tokens: any = JSON.parse(
                        localStorage.getItem("tokens")
                    );
                    if (!tokens) reject();
                    try {
                        const res = await axios.post(
                            "http://localhost:3001/api/auth/refreshToken",
                            { refreshToken: tokens.refreshToken }
                        );
                        const _tokens = {
                            accessToken: res.data.accessToken as string,
                            refreshToken: res.data.refreshToken as string,
                        };
                        setTokens(_tokens);
                        const payload: IPayload = jwt.decode(
                            tokens.accessToken
                        );
                        resolve(payload);
                    } catch (error) {
                        console.log(error.response);
                    }
                };
                generateRefreshToken();
            }
            reject(err);
        }
    });
};
