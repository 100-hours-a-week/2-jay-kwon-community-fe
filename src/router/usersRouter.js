import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>

const Login = lazy(() => import("../pages/users/LoginPage"))

const Signup = lazy(() => import("../pages/users/SignupPage"))

const usersRouter = () => {

    return [
        {
            path: "login",
            element: <Suspense fallback={Loading}><Login /></Suspense>
        },
        {
            path: "signup",
            element: <Suspense fallback={Loading}><Signup /></Suspense>,
        },
    ]

}

export default usersRouter
