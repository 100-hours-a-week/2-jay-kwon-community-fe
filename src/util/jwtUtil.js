import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getCookie, setCookie } from "./cookieUtil";
import API_SERVER_HOST from "../api/apiConfig";

const prefix = `${API_SERVER_HOST}/auth`;
const jwtAxios = axios.create();

// JWT 토큰의 만료 여부 확인
const isTokenExpired = (token) => {
    try {
        const { exp } = jwtDecode(token);
        return Date.now() / 1000 > exp;
    } catch (e) {
        return true;
    }
};

const refreshJWT = async (accessToken, refreshToken) => {
    const config = { headers: { "Authorization": `Bearer ${accessToken}` } };
    const res = await axios.put(`${prefix}/tokens?refreshToken=${refreshToken}`, null, config);
    return res.data;
};

// 요청 전에 토큰이 만료되었으면 갱신 로직 실행
const beforeReq = async (config) => {
    console.log("beforeRequest");
    const memberInfo = getCookie("member");
    if (!memberInfo) {
        console.log("memberNotFound");
        return Promise.reject({
            response: { data: { error: "requireLogin" } }
        });
    }

    let { accessToken, refreshToken } = memberInfo;

    if (isTokenExpired(accessToken)) {
        try {
            console.log("refreshing token...");
            const result = await refreshJWT(accessToken, refreshToken);

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data;
            accessToken = newAccessToken;
            refreshToken = newRefreshToken;

            memberInfo.accessToken = accessToken;
            memberInfo.refreshToken = refreshToken;
            setCookie("member", JSON.stringify(memberInfo));
        } catch (err) {
            console.error("토큰 갱신 실패:", err);
            return Promise.reject(err);
        }
    }

    // 최종적으로 (갱신된) 토큰을 헤더에 추가
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
};

const requestFail = (err) => {
    console.log("requestFailError");
    return Promise.reject(err);
};

const beforeRes = async (res) => {
    console.log("beforeReturnResponse");
    return res;
};

const responseFail = (err) => {
    console.log("responseFailError");
    return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
