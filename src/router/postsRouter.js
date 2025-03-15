import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>

const List = lazy(() => import("../pages/posts/ListPage"))

const Write = lazy(() => import("../pages/posts/WritePage"))

const Detail = lazy(() => import("../pages/posts/DetailPage"))

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
        {
            path: "detail/:postId",
            element: <Suspense fallback={Loading}><Detail /></Suspense>,
        },
    ]

}

export default usersRouter
