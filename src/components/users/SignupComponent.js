import React, { useState, useEffect } from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";
import { validateEmail, validatePassword, validateNickname } from "../../util/validator";
import { postImage } from "../../api/imageApi";
import { existsEmail, existsNickname, signupMember } from "../../api/usersApi";
import {Link} from "react-router-dom";

const initState = {
    profileImage: null,
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
};

const SignupComponent = () => {
    const [signupParam, setSignupParam] = useState({ ...initState });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const { moveToPath } = useCustomLogin();

    useEffect(() => {
        const isValid = signupParam.email && signupParam.password && signupParam.confirmPassword && signupParam.nickname && signupParam.profileImage && !Object.values(errors).some(error => error);
        setIsFormValid(isValid);
    }, [signupParam, errors]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setSignupParam({ ...signupParam, profileImage: files[0] });
        } else {
            setSignupParam({ ...signupParam, [name]: value });
        }
    };

    const handleBlur = async (e) => {
        const { name, value } = e.target;
        let validation;

        if (name === 'email') {
            validation = validateEmail(value);
            if (validation.valid) {
                const emailExists = await existsEmail(value);
                if (emailExists.data) {
                    validation = { valid: false, message: "*중복된 이메일입니다" };
                }
            }
        } else if (name === 'password') {
            validation = validatePassword(value);
        } else if (name === 'confirmPassword') {
            validation = validatePassword(value);
            if (value !== signupParam.password) {
                validation = { valid: false, message: "*비밀번호가 다릅니다" };
            }
        } else if (name === 'nickname') {
            validation = validateNickname(value);
            if (validation.valid) {
                const nicknameExists = await existsNickname(value);
                if (nicknameExists.data) {
                    validation = { valid: false, message: "*중복된 닉네임입니다" };
                }
            }
        }

        setErrors({ ...errors, [name]: validation ? validation.message : '' });
    };

    const handleClickSignup = async (e) => {
        if (!signupParam.profileImage) {
            setErrors({ ...errors, profileImage: "*프로필 사진을 추가해주세요" });
            return;
        }

        try {
            const imageResponse = await postImage(signupParam.profileImage, "PROFILE_IMAGE");
            if (imageResponse && imageResponse.data) {
                const { profileImage, confirmPassword, ...restSignupParam } = signupParam;
                const updatedSignupParam = {
                    ...restSignupParam,
                    profileImageUrl: imageResponse.data.fileName
                };

                const response = await signupMember(updatedSignupParam);
                if (response.message === "registerSuccess") {
                    setErrors({});
                    moveToPath('/');
                } else {
                    setErrors({ ...errors, form: response.message });
                }
            } else {
                setErrors({ ...errors, form: "*이미지 업로드 중 에러가 발생했습니다" });
            }
        } catch (err) {
            setErrors({ ...errors, form: "*회원가입에 실패했습니다. 다시 시도해주세요" });
        }
    };

    return (
        <div className="bg-[#F4F5F7] min-h-screen flex justify-center items-center">
            <div className="mt-10 m-2 p-4 w-full max-w-md">
                <div className="flex justify-center">
                    <div className="text-xl m-4 p-4 font-extrabold text-black">회원가입</div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch justify-center">
                        <div className="w-full p-1 text-left font-extrabold">프로필 사진</div>
                        {!signupParam.profileImage && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">*프로필 사진을 추가해주세요</div>}
                        <div className="relative w-32 h-32 rounded-full bg-[#C4C4C4] flex justify-center items-center cursor-pointer overflow-hidden">
                            <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                   name="profileImage"
                                   type="file"
                                   onChange={handleChange}
                            />
                            {signupParam.profileImage ? (
                                <img src={URL.createObjectURL(signupParam.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-black text-2xl">+</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">이메일*</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="email"
                               type="text"
                               value={signupParam.email}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="이메일을 입력하세요"
                        />
                        {errors.email && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">비밀번호*</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="password"
                               type="password"
                               value={signupParam.password}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="비밀번호를 입력하세요"
                        />
                        {errors.password && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.password}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">비밀번호 확인*</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="confirmPassword"
                               type="password"
                               value={signupParam.confirmPassword}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="비밀번호를 한 번 더 입력하세요"
                        />
                        {errors.confirmPassword && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">닉네임*</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="nickname"
                               type="text"
                               value={signupParam.nickname}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="닉네임을 입력하세요"
                        />
                        {errors.nickname && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.nickname}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full justify-center">
                        <div className="w-full p-3 flex justify-center font-bold">
                            <button className={`rounded-md p-3 w-full text-xl text-white ${isFormValid ? 'bg-[#ACA0EB] hover:bg-[#7F6AEE]' : 'bg-[#ACA0EB] cursor-not-allowed'}`} onClick={handleClickSignup} disabled={!isFormValid}>
                                회원가입
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Link to="/users/login" className="text-black hover:underline">
                        로그인하러 가기
                    </Link>
                </div>
                {errors.form && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.form}</div>}
            </div>
        </div>
    );
};

export default SignupComponent;
