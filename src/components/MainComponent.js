import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin";

function MainComponent(props) {
    const navigate = useNavigate();
    const { isLogin } = useCustomLogin();

    useEffect(() => {
        if (isLogin) {
            navigate("/posts/list");
        } else {
            navigate("/users/login");
        }
    }, [isLogin, navigate]);

    return (
        <div className="bg-[#F4F5F7] min-h-screen"></div>
    );
}

export default MainComponent;
