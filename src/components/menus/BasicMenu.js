import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getThumbnail } from "../../api/imageApi";

const BasicMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLogin, loginState } = useCustomLogin();
    const [profileImageData, setProfileImageData] = useState(null);

    const showBackButton = location.pathname !== '/';

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const imageData = await getThumbnail(loginState.profileImageUrl || 'default.png');
                setProfileImageData(imageData.fileContent);
            } catch (error) {
                console.error("Error fetching profile image:", error);
            }
        };

        if (isLogin) {
            fetchProfileImage();
        }
    }, [isLogin, loginState.profileImageUrl]);

    return (
        <div className="w-full bg-[#F4F5F7] flex flex-col items-center">
            <ul className="grid grid-cols-3 p-4 text-black font-bold items-center w-full">
                {showBackButton ? (
                    <li className="text-2xl cursor-pointer flex justify-end" onClick={() => navigate(-1)}>
                        &lt;
                    </li>
                ) : (
                    <li></li>
                )}
                <li className="text-2xl text-center col-span-1">
                    <Link to={'/'}>아무 말 대잔치</Link>
                </li>
                <li className="col-span-1 flex justify-start">
                    {isLogin && profileImageData && (
                        <img src={`data:image/jpeg;base64,${profileImageData}`} alt="Profile" className="w-8 h-8 rounded-full" />
                    )}
                </li>
            </ul>
            <hr className="w-full border-black" />
        </div>
    );
}

export default BasicMenu;
