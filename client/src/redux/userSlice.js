import { createSlice } from '@reduxjs/toolkit';

function parseJSONSafe(value) {
    try {
        if (!value || value === 'undefined' || value === 'null') return null;
        return JSON.parse(value);
    } catch {
        return null;
    }
}

const initialState = {
    userInfo: parseJSONSafe(localStorage.getItem('userInfo')), // теперь внутри: { user, token }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const userInfo = {
                user: action.payload.user,
                token: action.payload.token,
            };
            state.userInfo = userInfo;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
