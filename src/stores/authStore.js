import { makeAutoObservable } from "mobx";
import axios from "axios";
import ApiDefaults from "../defaults/ApiDefaults";
import axiosInstance from "../intercepts/axiosConfig";
import { makePersistable } from 'mobx-persist-store';
import { jwtDecode } from "jwt-decode";

// tailwind => bootstrap 
// MobX => redux, zustand, context api => state maanagement  => HOC, HOF => Higher Order Function, Higher Order Component

class AuthStore {
    user = null;
    userId = 0;
    customerId = 0;
    sellerId = 0;
    accessToken = null;
    isLoggedIn = false;
    role = "";
    errorMessage = "";
    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: 'auth',
            properties: ['user', 'accessToken', "isLoggedIn", "role", "errorMessage", "userId", "customerId"],
            storage: typeof window !== "undefined" ? window.localStorage : undefined
        })
    }

    async login(username, password) {

        return axios.post(`${ApiDefaults.BASE_URL}/auth/token/`, { username, password }).then(response => {
            const { refresh, access } = response.data;

            // this.user = user;
            this.accessToken = access;

            if (access) {
                this.isLoggedIn = true;
            }

            // Token'ları sakla


            const decoded = jwtDecode(access);
            this.userId = decoded.user_id
            localStorage.setItem("accessToken", access);

            localStorage.setItem("refreshToken", refresh);

            axiosInstance.get(`${ApiDefaults.BASE_URL}/auth/me`).then(response => {
                console.log("me response", response)


                this.role = response.data.role;

                if (response.data.role == "customer") {
                    console.log("custore decoded")
                    this.customerId = response.data.customerId;
                }
                else {
                    this.sellerId = response.data.sellerId;
                }
            });

            return response;

        }).catch(err => {
            console.error("Giriş hatası:", err);

            this.errorMessage = err.response?.data?.detail || err.message;

            return err;
        });



    }

    async register(email, password, name) {
        try {
            await axios.post("/auth/register", { email, password, name });
            alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        } catch (error) {
            console.error("Kayıt hatası:", error.response?.data?.message || error.message);
        }
    }

    async refreshAccessToken() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("Yenileme tokeni bulunamadı.");

            const response = await axios.post("/auth/refresh", { refreshToken });
            const { accessToken } = response.data;

            this.accessToken = accessToken;
            localStorage.setItem("accessToken", accessToken);
        } catch (error) {
            console.error("Token yenileme hatası:", error.message);
        }
    }

    logout() {
        this.user = null;
        this.accessToken = null;
        this.role = "";
        this.isLoggedIn = false;
        this.customerId = 0;
        this.sellerId = 0;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}



const authStore = new AuthStore();

export default authStore;