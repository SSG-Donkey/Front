let contnet = null;
let comment = null;

window.onload = function () {
    const postParameter = new URLSearchParams(window.location.search);
    const postNo = postParameter.get("postNo");
    const userNo=localStorage.getItem('userId');

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
            <main>
            <section class="post-detail">
              <header class="post-header d-flex align-items-center justify-content-between">
                <div>
                  <span class="badge rounded-pill bg-warning text-dark">나눔 중</span>
                  <h1 class="post-title my-2">${content.postTitle}</h1>
                  <p class="m-0">작성자: ${content.userNickname}</p>
                </div>
                <div>
                  <p class="m-0">책임비: ${content.point}</p>
                  <p id="pay" class="hidden m-0">책임비 결제</p>
                </div>
              </header>
              ${content.postFile ? `<img src="${content.postFile}" alt="게시물 사진" class="img-fluid my-3">` : ''}
              <div class="post-info">
                <p class="post-content">${content.postContent}</p>
                <div class="button-container d-flex justify-content-around my-3">
                  <form id="finishForm" class="me-2">
                    <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                    <input type="hidden" name="postNo" value="${content.postNo}">
                    <button class="btn btn-warning btn-lg" type="submit">나눔 완료</button>
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
                <div class="comments">
                  <h2>댓글</h2>
                  <form id="commentForm" class="d-flex mb-3">
                    <input type="text" name="commentContent" class="form-control me-2" placeholder="댓글 입력">
                    <input type="hidden" id="userNo" name="userNo" value="${userNo}">
                    <input type="hidden" name="postNo" value="${content.postNo}">
                    <input type="hidden" name="isChosen" value="0">
                    <button class="btn btn-primary btn-lg" type="submit">입력</button>
                  </form>
                  <div class="comment-list">
                    ${comment.map(comment => `
                      <div class="comment mb-3">
                        <div class="d-flex justify-content-between">
                          <p class="comment-info m-0"><strong>${comment.userNickname}</strong> | ${comment.commentDate}</p>
                        </div>
                        <p class="comment-content m-0">${comment.commentContent}</p>
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

    //나눔완료
    $(document).on('submit', '#finishForm', function (e) {
        e.preventDefault();

        $.ajax({
            url: 'https://www.dangnagwi.store/api_post/finish',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                alert(response.message);
                window.location.href = response.redirectUrl;
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert('나눔 완료 실패하였습니다.');
            }
        });
    });

    //삭제 폼
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
                // alert(response.message);
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
}
