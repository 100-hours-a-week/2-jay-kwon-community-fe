import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/usersApi";
import { getCookie, setCookie, removeCookie } from "../util/cookieUtil";

const initState = {
    email: ''
}

const loadMemberCookie = () => {
    const memberInfo = getCookie("member")

    if (memberInfo && memberInfo.nickname) {
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname)
    }

    return memberInfo
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
    return loginPost(param)
})

const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState: loadMemberCookie() || initState,
    reducers: {
        login: (state, action) => {
            const payload = action.payload.data;
            setCookie("member", JSON.stringify(payload));
            return payload;
        },
        logout: (state, action) => {
            removeCookie("member");
            return { ...initState };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginPostAsync.fulfilled, (state, action) => {
            const payload = action.payload.data;

            if (payload) {
                setCookie("member", JSON.stringify(payload));
            }

            return payload;
        })
            .addCase(loginPostAsync.pending, (state,action) => {
                console.log("pending")
            })
            .addCase(loginPostAsync.rejected, (state,action) => {
                console.log("rejected")
            })
    }
})

export const {login,logout} = loginSlice.actions

export default loginSlice.reducer
