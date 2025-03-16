// 숫자 포맷팅 함수: 1000 이상이면 K 단위로 표시
function formatCount(count) {
    if (count >= 1000) {
        return Math.floor(count / 1000) + 'K';
    }
    return count;
}

// 날짜 포맷팅 함수: "yyyy-mm-dd hh:mm:ss" 형식으로 변환
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 제목을 최대 길이(26)로 자르고 "..."을 추가하는 함수
function truncateTitle(title, maxLength = 26) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength) + '...';
    }
    return title;
}

export { formatCount, formatDate, truncateTitle };
