import DetailComponent from "../../components/posts/DetailComponent";
import BasicLayout from "../../layouts/BasicLayout";
import React from "react";

const DetailPage = () => {
    return (
        <>
            <BasicLayout>
                <DetailComponent />
            </BasicLayout>
        </>
    );
}

export default DetailPage;
