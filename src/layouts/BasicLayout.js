import React from 'react';
import BasicMenu from '../components/menus/BasicMenu';

const BasicLayout = ({ children }) => {
    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50">
                <BasicMenu />
            </div>
            {children}
        </>
    );
}

export default BasicLayout;
