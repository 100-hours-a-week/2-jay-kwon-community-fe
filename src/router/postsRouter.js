import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>

const List = lazy(() => import("../pages/posts/ListPage"))

const Write = lazy(() => import("../pages/posts/WritePage"))

const usersRouter = () => {

    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><List /></Suspense>
        },
        {
            path: "write",
            element: <Suspense fallback={Loading}><Write /></Suspense>
        },
    ]

}

export default usersRouter
