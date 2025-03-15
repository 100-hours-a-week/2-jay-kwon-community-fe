import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import { validateEmail, validatePassword } from "../../util/validator";

const initState = {
    email: '',
    password: ''
};

const LoginComponent = () => {
    const [loginParam, setLoginParam] = useState({ ...initState });
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const { doLogin, moveToPath } = useCustomLogin();

    useEffect(() => {
        const isValid = validateEmail(loginParam.email).valid && validatePassword(loginParam.password).valid;
        setIsFormValid(isValid);
    }, [loginParam]);

    const handleChange = (e) => {
        loginParam[e.target.name] = e.target.value;
        setLoginParam({ ...loginParam });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let validation;

        if (name === 'email') {
            validation = validateEmail(value);
        } else if (name === 'password') {
            validation = validatePassword(value);
        }

        setError(validation.message);
    };

    const handleClickLogin = (e) => {
        doLogin(loginParam)
            .then(response => {
                if (response.success) {
                    setError('');
                    moveToPath('/');
                } else {
                    setError(response.message === "invalidCredentials" ? "이메일과 패스워드를 다시 확인하세요" : response.message);
                }
            })
            .catch(err => {
                setError("*이메일과 패스워드를 다시 확인하세요");
            });
    };

    return (
        <div className="bg-[#F4F5F7] min-h-screen flex justify-center items-center">
            <div className="mt-10 m-2 p-4 w-full max-w-md">
                <div className="flex justify-center">
                    <div className="text-xl m-4 p-4 font-extrabold text-black">로그인</div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">이메일</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="email"
                               type="text"
                               value={loginParam.email}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="이메일을 입력하세요"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">비밀번호</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="password"
                               type="password"
                               value={loginParam.password}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="비밀번호를 입력하세요"
                        />
                        {error && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{error}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full justify-center">
                        <div className="w-full p-3 flex justify-center font-bold">
                            <button className={`rounded-md p-3 w-full text-xl text-white ${isFormValid ? 'bg-[#ACA0EB] hover:bg-[#7F6AEE]' : 'bg-[#ACA0EB] cursor-not-allowed'}`} onClick={handleClickLogin} disabled={!isFormValid}>
                                로그인
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Link to="/users/signup" className="text-black hover:underline">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
