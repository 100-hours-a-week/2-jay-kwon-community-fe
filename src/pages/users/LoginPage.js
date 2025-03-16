import LoginComponent from "../../components/users/LoginComponent";
import BasicLayout from "../../layouts/BasicLayout";
import React from "react";

const LoginPage = () => {
    return (
        <>
            <BasicLayout>
                <LoginComponent />
            </BasicLayout>
        </>
    );
}

export default LoginPage;
