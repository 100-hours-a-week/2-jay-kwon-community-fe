import { useDispatch, useSelector } from "react-redux"
import { Navigate, createSearchParams, useNavigate } from "react-router-dom"
import { loginPostAsync, logout } from "../slices/loginSlice"

const useCustomLogin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const loginState = useSelector(state => state.loginSlice)

    const isLogin = loginState.email ? true : false

    const doLogin = async (loginParam) => {
        const action = await dispatch(loginPostAsync(loginParam))
        if (action.payload && action.payload.data) {
            return { success: true, data: action.payload.data };
        } else {
            return { success: false, message: action.payload.message || "로그인 실패" };
        }
    }

    const doLogout = () => {
        dispatch(logout())
    }

    const moveToPath = (path) => {
        navigate({ pathname: path }, { replace: true })
    }

    const moveToLogin = () => {
        navigate({ pathname: '/users/login' }, { replace: true })
    }

    const moveToLoginReturn = () => {
        return <Navigate replace to="/users/login" />
    }

    const exceptionHandle = (ex) => {

        console.log("Exception")
        console.log(ex)

        const errorMsg = ex.response.data.error

        const errorStr = createSearchParams({error: errorMsg}).toString()

        if (errorMsg === 'requireLogin') {
            alert("로그인 해야만 합니다.")
            navigate({pathname:'/users/login' , search: errorStr})

            return
        }

        if (ex.response.data.error === 'accessDenied') {
            alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.")
            navigate({pathname:'/users/login' , search: errorStr})
            return
        }
    }

    return {
        loginState, isLogin, doLogin, doLogout, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle
    }
}

export default useCustomLogin
