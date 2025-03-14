import React from 'react';
import MainComponent from '../components/MainComponent';
import BasicLayout from "../layouts/BasicLayout";

const MainPage = () => {
    return (
        <>
            <BasicLayout>
                <MainComponent />
            </BasicLayout>
        </>
    );
}

export default MainPage;
