import { Suspense, lazy } from "react";
import usersRouter from "./usersRouter";
import postsRouter from "./postsRouter";

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
    {
        path: "posts",
        children: postsRouter()
    },
])

export default root
