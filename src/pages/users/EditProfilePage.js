import EditProfileComponent from "../../components/users/EditProfileComponent";
import BasicLayout from "../../layouts/BasicLayout";
import React from "react";

const EditProfilePage = () => {
    return (
        <>
            <BasicLayout>
                <EditProfileComponent />
            </BasicLayout>
        </>
    );
}

export default EditProfilePage;
