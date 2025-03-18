import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useCustomLogin from "../../hooks/useCustomLogin";
import { validateEmail, validateNickname } from "../../util/validator";
import { postImage, getImage } from "../../api/imageApi";
import { existsEmail, existsNickname, modifyMember, getMember, removeMember } from "../../api/usersApi";
import { updateLoginInfo, logout } from "../../slices/loginSlice";
import BasicToast from "../toasts/BasicToast";
import useToast from "../../hooks/useToast";
import useModal from "../../hooks/useModal";
import BasicModal from "../modals/BasicModal";

const initState = {
    email: '',
    nickname: ''
};

const EditProfileComponent = () => {
    const [profileParam, setProfileParam] = useState({ ...initState });
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [displayProfileImageData, setDisplayProfileImageData] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const { userId } = useParams();
    const { loginState } = useCustomLogin();
    const { isOpen, message, showToast, closeToast } = useToast();
    const { isOpen: isModalOpen, modalContent, openModal, closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMemberData = async () => {
            const response = await getMember(userId);
            const memberData = response.data;
            setProfileParam({
                email: memberData.email,
                nickname: memberData.nickname
            });
            const imageResponse = await getImage(memberData.profileImageUrl);
            setDisplayProfileImageData(imageResponse.fileContent);
        };

        fetchMemberData();
    }, [userId]);

    useEffect(() => {
        const isValid = profileParam.email && profileParam.nickname && !Object.values(errors).some(error => error);
        setIsFormValid(isValid);
    }, [profileParam, errors]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setSelectedImageFile(files[0]);
        } else {
            setProfileParam({ ...profileParam, [name]: value });
        }
    };

    const handleBlur = async (e) => {
        const { name, value } = e.target;
        let validation;

        if (name === 'email') {
            validation = validateEmail(value);
            if (validation.valid && value !== loginState.email) {
                const emailExists = await existsEmail(value);
                if (emailExists.data) {
                    validation = { valid: false, message: "*중복된 이메일입니다" };
                }
            }
        } else if (name === 'nickname') {
            validation = validateNickname(value);
            if (validation.valid && value !== loginState.nickname) {
                const nicknameExists = await existsNickname(value);
                if (nicknameExists.data) {
                    validation = { valid: false, message: "*중복된 닉네임입니다" };
                }
            }
        }

        setErrors({ ...errors, [name]: validation ? validation.message : '' });
    };

    const handleClickSave = async () => {
        try {
            let updatedProfileParam = {
                email: profileParam.email,
                nickname: profileParam.nickname
            };

            if (selectedImageFile) {
                const imageResponse = await postImage(selectedImageFile, "PROFILE_IMAGE");
                updatedProfileParam.profileImageUrl = imageResponse.data.fileName;
            }

            const response = await modifyMember(userId, updatedProfileParam);
            if (response.message === "modifySuccess") {
                setErrors({});
                const updatedLoginInfo = {
                    ...loginState,
                    email: profileParam.email,
                    nickname: profileParam.nickname
                };
                if (updatedProfileParam.profileImageUrl) {
                    updatedLoginInfo.profileImageUrl = updatedProfileParam.profileImageUrl;
                }
                dispatch(updateLoginInfo(updatedLoginInfo));
                showToast("수정 완료");
            } else {
                setErrors({ form: response.message });
            }
        } catch (err) {
            setErrors({ form: "*회원정보 수정에 실패했습니다. 다시 시도해주세요" });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await removeMember(userId);
            dispatch(logout());
            closeModal();
            navigate('/');
        } catch (err) {
            setErrors({ form: "*회원 탈퇴에 실패했습니다. 다시 시도해주세요" });
        }
    };

    const openDeleteAccountModal = () => {
        openModal("회원 탈퇴하시겠습니까?", "작성된 게시글과 댓글은 삭제됩니다.");
    };

    return (
        <div className="bg-[#F4F5F7] min-h-screen flex justify-center items-center">
            <div className="mt-10 m-2 p-4 w-full max-w-md">
                <div className="flex justify-center">
                    <div className="text-xl m-4 p-4 font-extrabold text-black">회원정보 수정</div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch justify-center">
                        <div className="w-full p-1 text-left font-extrabold">프로필 사진</div>
                        <div className="relative w-32 h-32 rounded-full bg-[#C4C4C4] flex justify-center items-center cursor-pointer overflow-hidden">
                            <input
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                name="profileImage"
                                type="file"
                                onChange={handleChange}
                                accept=".jpg, .jpeg, .png"
                            />
                            {selectedImageFile ? (
                                <img src={URL.createObjectURL(selectedImageFile)} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <img src={`data:image/jpeg;base64,${displayProfileImageData}`} alt="Profile" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-0">
                                <div className="text-white border-2 border-white rounded-full px-3 py-1">변경</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">이메일*</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="email"
                               type="text"
                               value={profileParam.email}
                               onChange={handleChange}
                               onBlur={handleBlur}
                               placeholder="이메일을 입력하세요"
                        />
                        {errors.email && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-full p-1 text-left font-extrabold">닉네임*</div>
                        <input className="w-full p-3 rounded border border-neutral-500"
                               name="nickname"
                               type="text"
                               value={profileParam.nickname}
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
                            <button className={`rounded-md p-3 w-full text-xl text-white ${isFormValid ? 'bg-[#ACA0EB] hover:bg-[#7F6AEE]' : 'bg-[#ACA0EB] cursor-not-allowed'}`} onClick={handleClickSave} disabled={!isFormValid}>
                                수정 완료
                            </button>
                        </div>
                    </div>
                </div>
                {errors.form && <div className="w-full p-1 text-left text-red-500 text-sm mt-1">{errors.form}</div>}
                <div className="flex justify-center">
                    <Link to="#" onClick={openDeleteAccountModal} className="text-black hover:underline">
                        회원 탈퇴
                    </Link>
                </div>
                <BasicToast isOpen={isOpen} message={message} onClose={closeToast} />
                <BasicModal
                    isOpen={isModalOpen}
                    title={modalContent.title}
                    message={modalContent.message}
                    onClose={closeModal}
                    onConfirm={handleDeleteAccount}
                />
            </div>
        </div>
    );
};

export default EditProfileComponent;
