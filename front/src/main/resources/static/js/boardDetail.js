window.onload = function () {
    const postParameter = new URLSearchParams(window.location.search);
    const postNo = postParameter.get("postNo");
    console.log("첫 postNo 값 : " + postNo);
    loadPostNumber(postNo);
};

function loadPostNumber(postNo) {
    $.ajax({
        url: `https://www.dangnagwi.store/api_post/post/${postNo}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const content = data.content;
            const comment = data.comment;
            console.log("postNo :" + postNo);
            console.log("게시글: " + content);
            console.log("작성자: " + content.userNickname);

            $('.container').empty();

            const itemElement = $('<article>').addClass('content');
            itemElement.html(`
                <main>
                    <section class="post-detail">
                        <div class="post-header">
                            <p id="state">나눔 중</p>
                            <h1 class="post-title">제목: ${content.postTitle}</h1>
                            <p id="pay" class="hidden">책임비 결제</p>
                            <p>작성자 : ${content.userNickname}</p>
                        </div>
                        ${content.postFile ? `<img src="${content.postFile}" alt="게시물 사진">` : ''} 
                        <div class="post-info">
                            <p class="post-content">내용: ${content.postContent}</p>
                            <div class="comments">
                                <h2>댓글</h2>
                                <form id="commentForm">
                                    <input type="text" name="commentContent">
                                    <input type="hidden" name="userNo" value="1">
                                    <input type="hidden" name="postNo" value="${content.postNo}">
                                    <input type="hidden" name="isChosen" value="0">
                                    <button class="input-button" type="submit">입력</button>
                                </form>
                                <div class="comment-list">
                                    ${comment.map(comment => `
                                        <div class="comment">
                                            <p class="comment-info">${comment.userNickname} | ${comment.commentDate}</p>
                                            <p class="comment-content">${comment.commentContent}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            `);

            $('.container').append(itemElement);

            // 나눔 완료 상태
            if (content.postStatus === '1') {
                $('#pay').removeClass('hidden');
                $('#state').text('나눔 완료').css('color', 'green');
            }
        },
        error: function (xhr, status, error) {
            console.error('데이터를 불러오는 중 에러 발생:', error);
        }
    });

    // 댓글 폼 제출 이벤트 핸들러
    $(document).on('submit', '#commentForm', function (e) {
        e.preventDefault();

        $.ajax({
            url: 'https://www.dangnagwi.store/comment/insertComment',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                alert(response.message);
                window.location.href = response.redirectUrl;
            },
            error: function (xhr, status, error) {
                alert('댓글 추가에 실패하였습니다.');
            }
        });
    });
}
