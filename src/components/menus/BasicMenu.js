import React from "react";
import { Link } from "react-router-dom";

const BasicMenu = () => {
    return (
        <div className="w-full bg-[#F4F5F7] flex flex-col items-center">
            <ul className="flex p-4 text-black font-bold">
                <li className="text-2xl">
                    <Link to={'/'}>아무 말 대잔치</Link>
                </li>
            </ul>
            <hr className="w-full border-black" />
        </div>
    );
}

export default BasicMenu;
