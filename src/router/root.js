import { Suspense, lazy } from "react";
import usersRouter from "./usersRouter";

const { createBrowserRouter } = require("react-router-dom");

const Loading = <div className="loading-image"></div>

const Main = lazy(() => import("../pages/MainPage"))

const root = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: "users",
        children: usersRouter()
    },
])

export default root
