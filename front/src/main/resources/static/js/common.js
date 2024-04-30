// common.js
function updateLoginStatus() {
    if (localStorage.getItem('authToken')) {
        $('#login-status').html('<a href="#" onclick="logout()">로그아웃</a>');
    } else {
        $('#login-status').html('<a href="loginForm.html">로그인/회원가입</a>');
    }
}

function logout() {
    localStorage.removeItem('authToken'); // 로컬 스토리지에서 토큰 제거
    updateLoginStatus(); // UI 업데이트
    window.location.href = 'index.html'; // 홈페이지로 리다이렉트
}


