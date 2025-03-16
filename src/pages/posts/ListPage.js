import ListComponent from "../../components/posts/ListComponent";
import BasicLayout from "../../layouts/BasicLayout";
import React from "react";

const ListPage = () => {
    return (
        <>
            <BasicLayout>
                <ListComponent />
            </BasicLayout>
        </>
    );
}

export default ListPage;
