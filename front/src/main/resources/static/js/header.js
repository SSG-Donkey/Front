$(document).ready(function () {
    // 검색 실행 함수
    function executeSearch() {
        // 검색어 가져오기
        const searchTerm = $('.search-bar').val().trim();
        console.log('검색어:', searchTerm);

        // 검색어가 비어있지 않은 경우에만 검색 페이지로 이동
        if (searchTerm !== '') {
            // 검색 페이지 URL 생성 (검색어를 query parameter로 추가)
            const searchUrl = '/board.html?search=' + encodeURIComponent(searchTerm);
            // 검색 페이지로 이동
            window.location.href = searchUrl;
        }
    }

    // 검색창에서 엔터 키를 눌렀을 때 검색 실행
    $('.search-bar').on('keypress', function (event) {
        if (event.which === 13) { // 엔터 키의 keyCode는 13입니다.
            executeSearch();
        }
    });

    // "검색하기" 버튼을 클릭했을 때 검색 실행
    $('button').on('click', function () {
        executeSearch();
    });

    // 검색 페이지 로드 시 검색어가 있는 경우 API를 호출하여 결과를 가져옴
    if (window.location.pathname === '/board.html' && window.location.search.includes('search=')) {
        const searchTerm = new URLSearchParams(window.location.search).get('search');
        console.log("검색 내용 : " + searchTerm);

        const page = 0; // 페이지 수
        const pageSize = 10; // 페이지당 항목 수

        fetch(`/api_post/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                // 여기서는 받아온 데이터를 처리하여 결과를 표시합니다.
                console.log('검색 결과:', data);
                currentPage = data.currentPage;
                totalPages = data.totalPages;

                console.log('currentPage:', data.currentPage);
                console.log('totalPages:', data.totalPages);

                renderPosts(data.data);
                renderPagination();
            })
            .catch(error => {
                console.error('검색 API 호출 중 오류 발생:', error);
            });
    }
});
