// common.js
function updateLoginStatus() {
    var token = localStorage.getItem('authToken');
    if (token) {
        $('#login-status').html('<a href="#" onclick="logout()">로그아웃</a>');
        $('#mypage-link').show();  // 로그인 상태에서 마이페이지 링크 보이기
    } else {
        $('#login-status').html('<a href="loginForm.html">로그인/회원가입</a>');
        $('#mypage-link').hide();  // 로그아웃 상태에서 마이페이지 링크 숨기기
    }
}

function logout() {
    localStorage.removeItem('authToken'); // 로컬 스토리지에서 토큰 제거
    updateLoginStatus(); // UI 업데이트
    window.location.href = 'index.html'; // 홈페이지로 리다이렉트
}
