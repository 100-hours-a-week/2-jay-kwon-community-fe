import { useState, useEffect } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import { validatePassword } from "../../util/validator";
import { changePassword } from "../../api/usersApi";
import BasicToast from "../toasts/BasicToast";
import useToast from "../../hooks/useToast";

const initState = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
};

const ChangePasswordComponent = () => {
    const [passwordParam, setPasswordParam] = useState({ ...initState });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const { loginState, exceptionHandle } = useCustomLogin();
    const { isOpen, message, showToast, closeToast } = useToast();

    useEffect(() => {
        const isValid = validatePassword(passwordParam.currentPassword).valid &&
            validatePassword(passwordParam.newPassword).valid &&
            passwordParam.newPassword === passwordParam.confirmPassword;
        setIsFormValid(isValid);
    }, [passwordParam]);

    const handleChange = (e) => {
        passwordParam[e.target.name] = e.target.value;
        setPasswordParam({ ...passwordParam });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let validation;

        if (name === 'currentPassword' || name === 'newPassword' || name === 'confirmPassword') {
            validation = validatePassword(value);
            if (name === 'confirmPassword' && value !== passwordParam.newPassword) {
                validation = { valid: false, message: "*비밀번호와 다릅니다" };
            }
        }

        setErrors({ ...errors, [name]: validation.message });
    };

    const handleClickChangePassword = async (e) => {
        try {
            const passwordData = {
                oldPassword: passwordParam.currentPassword,
                newPassword: passwordParam.newPassword
            };
            const response = await changePassword(loginState.id, passwordData);
            if (response.message === "modifySuccess") {
                setErrors({});
                showToast("수정 완료");
            } else {
                setErrors({ form: response.message });
            }
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data.message === "invalidPassword") {
                setErrors({ currentPassword: "*비밀번호가 일치하지 않습니다" });
            } else {
                exceptionHandle(err);
            }
        }
    };

    return (
        <div className="bg-[#F4F5F7] min-h-screen flex justify-center items-center">
            <div className="mt-10 m-2 p-4 w-full max-w-md">
                <div className="flex justify-center">
                    <div className="text-xl m-4 p-4 font-extrabold text-black">비밀번호 수정</div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">현재 비밀번호</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="currentPassword"
                               type="password"
                               value={passwordParam.currentPassword}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="현재 비밀번호를 입력하세요"
                        />
                        {errors.currentPassword && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.currentPassword}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">변경할 비밀번호</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="newPassword"
                               type="password"
                               value={passwordParam.newPassword}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="변경할 비밀번호를 입력하세요"
                        />
                        {errors.newPassword && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.newPassword}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">비밀번호 확인</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="confirmPassword"
                               type="password"
                               value={passwordParam.confirmPassword}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="비밀번호를 한 번 더 입력하세요"
                        />
                        {errors.confirmPassword && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full justify-center">
                        <div className="w-full p-3 flex justify-center font-bold">
                            <button className={`rounded-md p-3 w-full text-xl text-white ${isFormValid ? 'bg-[#ACA0EB] hover:bg-[#7F6AEE]' : 'bg-[#ACA0EB] cursor-not-allowed'}`} onClick={handleClickChangePassword} disabled={!isFormValid}>
                                수정하기
                            </button>
                        </div>
                    </div>
                </div>
                <BasicToast isOpen={isOpen} message={message} onClose={closeToast} />
            </div>
        </div>
    );
};

export default ChangePasswordComponent;
