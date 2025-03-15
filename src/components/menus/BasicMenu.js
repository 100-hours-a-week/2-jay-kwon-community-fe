import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getThumbnail } from "../../api/imageApi";

const BasicMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLogin, loginState } = useCustomLogin();
    const [profileImageData, setProfileImageData] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { doLogout, moveToPath } = useCustomLogin();

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        doLogout()
        moveToPath("/")
    };

    return (
        <div className="w-full bg-[#F4F5F7] flex flex-col items-center relative">
            <ul className="grid grid-cols-3 p-3 text-black font-bold items-center w-full">
                {showBackButton ? (
                    <li className="text-4xl mb-2 cursor-pointer flex justify-end" onClick={() => navigate(-1)}>
                        &lt;
                    </li>
                ) : (
                    <li></li>
                )}
                <li className="text-2xl text-center col-span-1">
                    <Link to={'/'}>아무 말 대잔치</Link>
                </li>
                <li className="col-span-1 flex justify-start relative">
                    {isLogin && profileImageData && (
                        <img
                            src={`data:image/jpeg;base64,${profileImageData}`}
                            alt="Profile"
                            className="w-9 h-9 rounded-full cursor-pointer"
                            onClick={toggleDropdown}
                        />
                    )}
                    {isDropdownOpen && (
                        <div className="absolute top-10 left-0 transform -translate-x-3/4 bg-[#D9D9D9] shadow-lg w-36 z-10">
                            <ul className="m-0 p-0">
                                <li className="py-2 text-center text-sm text-black cursor-pointer hover:bg-[#E9E9E9]">
                                    회원정보수정
                                </li>
                                <li className="py-2 text-center text-sm text-black cursor-pointer hover:bg-[#E9E9E9]">
                                    비밀번호수정
                                </li>
                                <li className="py-2 text-center text-sm text-black cursor-pointer hover:bg-[#E9E9E9]" onClick={handleLogout}>
                                    로그아웃
                                </li>
                            </ul>
                        </div>
                    )}
                </li>
            </ul>
            <hr className="w-full border-black" />
        </div>
    );
}

export default BasicMenu;
