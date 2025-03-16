import SignupComponent from "../../components/users/SignupComponent";
import BasicLayout from "../../layouts/BasicLayout";
import React from "react";

const SignupPage = () => {
    return (
        <>
            <BasicLayout>
                <SignupComponent />
            </BasicLayout>
        </>
    );
}

export default SignupPage;
