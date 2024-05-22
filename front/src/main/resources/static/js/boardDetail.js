let contnet = null;
let comment = null;

window.onload = function () {
    const postParameter = new URLSearchParams(window.location.search);
    const postNo = postParameter.get("postNo");
    const userNo=28;

    loadPostNumber(postNo,userNo);
};



function loadPostNumber(postNo, userNo) {
    $.ajax({
        url: `https://www.dangnagwi.store/api_post/post/${postNo}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            content = data.content;
            comment = data.comment;

            $('.container').empty();

            const itemElement = $('<article>').addClass('content');
            itemElement.html(`
                <main class="container my-5">
                    <section class="post-detail">
                    <div class="post-header text-center mb-5">
                    <span id="state" class="badge bg-primary fs-5 py-2 px-3 mb-3">나눔 중</span>
                    <h1 class="post-title display-4 fw-bold mb-4">${content.postTitle}</h1>
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="post-author me-5">
                        <i class="bi bi-person-fill me-2"></i>
                        <span class="fw-bold">${content.userNickname}</span>
                        </div>
                        <div class="post-fee">
                        <i class="bi bi-cash-coin me-2"></i>
                        <span class="fw-bold">${content.point}</span>
                        </div>
                    </div>
                    </div>
                  ${content.postFile ? `<img src="${content.postFile}" alt="게시물 사진" class="img-fluid mx-auto d-block mb-4" style="max-width: 100%; max-height: 500px;">` : ''}
                  <div class="post-info">
                    <p class="post-content">${content.postContent}</p>
                    <div class="d-flex justify-content-end">
                      <div class="btn-group" role="group">
                 
                        <form id="shareForm" class="me-2">
                          <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                          <input type="hidden" name="postNo" value="${content.postNo}">
                            <button class="yellow-button btn-lg" type="submit">나눔중으로 되돌리기(임시기능)</button>
                        </form>
                        
                        <form id="updateForm" class="me-2">
                          <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                          <input type="hidden" name="postNo" value="${content.postNo}">
                          <button class="btn btn-success btn-lg" type="submit">게시글 수정</button>
                        </form>
                        <form id="deleteForm">
                          <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                          <input type="hidden" name="postNo" value="${content.postNo}">
                          <button class="btn btn-danger btn-lg" type="submit">게시글 삭제</button>
                        </form>
                      </div>
                    </div>
                  </div>

                            <div class="comments">
                                <h2>댓글</h2>
                                <form id="commentForm">
                                    <input type="text" name="commentContent">
                                    <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                                    <input type="hidden" name="postNo" value="${content.postNo}">
                                    <input type="hidden" name="isChosen" value="0">
                                    <button class="input-button" type="submit">입력</button>
                                </form>
                                <div class="comment-list">
                                    ${comment.map(comment => `
                                        <div class="comment">
                                            <p class="comment-info">${comment.userNickname} ( ${comment.commentDate})</p>
                                            <p class="comment-content">${comment.commentContent}</p>
                                            <div class="comment-actions">
                                        ${(content.userNo == userNo  && comment.userNo!=content.userNo) ? `
                                        <form id="selectUser">
                                            <input type="hidden" id="postNo" name="postNo" value="${content.postNo}">
                                            <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                                            <input type="hidden" id="postuserNo" name="postuserNo" value="${content.userNo}">
                                            <input type="hidden" id="point" name="point" value="${content.point}">
                                            <input type="hidden" id="commentNo" name="commentNo" value="${comment.commentNo}">
                                            <button class="select-button" type="submit">나눔채택</button>
                                        </form>` : ''}

                                            <form id="deleteCommentForm">
                                                <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                                                <input type="hidden" id="point" name="point" value="${content.point}">
                                                <input type="hidden"  id="postNo" name="postNo" value="${content.postNo}">
                                                 <input type="hidden" id="commentNo" name="commentNo" value="${comment.commentNo}">
                                            <button class="delete-button" type="submit">댓글삭제</button>
                                            </form>
                                            </div>
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
                $('#state').text('나눔 완료').removeClass('bg-primary').addClass('bg-success');
            }
        },
        error: function (xhr, status, error) {
            console.error('데이터를 불러오는 중 에러 발생:', error);
        }
    });

    //나눔완료
    $(document).on('submit', '#shareForm', function (e) {
        e.preventDefault();

        $.ajax({
            url: 'https://www.dangnagwi.store/api_post/share',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                alert(response.message);
                window.location.href = response.redirectUrl;
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert('나눔중 상태로 변경실패 하였습니다.');
            }
        });
    });

    //글 삭제 폼
    $(document).on('submit', '#deleteForm', function (e) {
        e.preventDefault();

        $.ajax({
            url: 'https://www.dangnagwi.store/api_post/delete',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                alert(response.message);
                window.location.href = response.redirectUrl;
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert('게시글 삭제 실패하였습니다.');
            }
        });
    });

    //업데이트 폼
    $(document).on('submit', '#updateForm', function (e) {
        e.preventDefault();

        $.ajax({
            url: 'https://www.dangnagwi.store/api_post/update',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                 alert(response.message);
                window.location.href = response.redirectUrl;
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert(' 수정 권한이 없습니다');
                window.location.href = "https://www.dangnagwi.store/boardDetail.html?postNo="+postNo;
            }
        });
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
                console.log(error);
                alert('댓글 추가에 실패하였습니다.');
            }
        });
    });

    // 댓글 삭제
    $(document).on('submit', '#deleteCommentForm', function (e) {
        e.preventDefault();

        $.ajax({
            url: 'https://www.dangnagwi.store/comment/deleteComment',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                alert(response.message);
                window.location.href = response.redirectUrl;
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert('댓글 삭제 실패하였습니다.');
            }
        });
    });

    $(document).on('submit', '#selectUser', function (e) {
        e.preventDefault();

        $.ajax({
            url: 'https://www.dangnagwi.store/comment/select',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                alert(response.message);
                window.location.href = response.redirectUrl;
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert(response.message);
            }
        });
    });
}