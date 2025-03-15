import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>

const List = lazy(() => import("../pages/posts/ListPage"))

const usersRouter = () => {

    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><List /></Suspense>
        },
    ]

}

export default usersRouter
