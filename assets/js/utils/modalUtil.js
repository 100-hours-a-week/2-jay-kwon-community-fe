const modalUtil = {
    /**
     * 모달의 취소, 확인 버튼에 이벤트 핸들러를 등록합니다.
     * onConfirm 콜백은 확인 버튼 클릭 시 실행됩니다.
     * @param {string} modalId - 모달 요소의 id
     * @param {string} cancelButtonId - 취소 버튼의 id
     * @param {string} confirmButtonId - 확인 버튼의 id
     * @param {Function} onConfirm - 확인 버튼 클릭 시 실행할 콜백 함수
     */
    initModal: function (modalId, cancelButtonId, confirmButtonId, onConfirm) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const cancelBtn = document.getElementById(cancelButtonId);
        const confirmBtn = document.getElementById(confirmButtonId);

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modalUtil.closeModal(modalId);
            });
        }

        if (confirmBtn && typeof onConfirm === 'function') {
            confirmBtn.addEventListener('click', () => {
                onConfirm();
                modalUtil.closeModal(modalId);
            });
        }
    },

    /**
     * 지정된 모달을 열고, 옵션에 따라 제목과 메시지를 설정합니다.
     * @param {string} modalId - 모달 요소의 id
     * @param {Object} options - { title: string, message: string }
     */
    openModal: function (modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        if (options.title) {
            const titleElem = modal.querySelector('h3');
            if (titleElem) {
                titleElem.textContent = options.title;
            }
        }
        if (options.message) {
            const messageElem = modal.querySelector('p');
            if (messageElem) {
                messageElem.textContent = options.message;
            }
        }
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    /**
     * 지정된 모달을 닫습니다.
     * @param {string} modalId - 모달 요소의 id
     */
    closeModal: function (modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

// 전역으로 노출
window.modalUtil = modalUtil;
