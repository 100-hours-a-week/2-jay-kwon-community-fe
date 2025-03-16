import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>

const Login = lazy(() => import("../pages/users/LoginPage"))

const Signup = lazy(() => import("../pages/users/SignupPage"))

const ChangePassword = lazy(() => import("../pages/users/ChangePasswordPage"))

const EditProfile = lazy(() => import("../pages/users/EditProfilePage"))

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
        {
            path: "modify/:userId/password",
            element: <Suspense fallback={Loading}><ChangePassword /></Suspense>,
        },
        {
            path: "modify/:userId/profile",
            element: <Suspense fallback={Loading}><EditProfile /></Suspense>,
        },
    ]

}

export default usersRouter
