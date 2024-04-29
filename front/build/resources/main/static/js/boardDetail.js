window.onload = function () {
    const postParameter = new URLSearchParams(window.location.search);
    const post = postParameter.get("post")
    loadPostNumber(post);
};

function loadPostNumber(post) {
    fetch(`/proxy/api_post/post/${post}`)
        .then(response => response.json())
        .then(data => {
            const content = data.content;
            const comment = data.comment;
            console.log("게시글: "+content)
            console.log("작성자: "+content.userNickname)
            const containerWrap = document.querySelector('.container')
            containerWrap.innerHTML = '';

            const itemElement = document.createElement('article');
            itemElement.classList.add('content')
            itemElement.innerHTML = `
                        <main>
                            <section class="post-detail">
                                <div class="post-header">
                                    <p id="state" >나눔 중</p>
                                    <h1 class="post-title">제목:  ${content.postTitle}</h1>
                                    <p id="pay" class="hidden">책임비 결제</p>
                                    <p>작성자 : ${content.userNickname}</p>
                                </div>
                            <img src=${content.postFile} alt="게시물 사진">
                           
                            <div class="post-info">
                                <p class="post-content">내용: ${content.postContent}</p>
                                <div class="comments">
                                    <h2>댓글</h2>
                                    <form action="/comment/insertComment" method="post">
                                        <input type="text" name="commentContent">
                                        <!-- userNo 값 seesion으로 바꿔주기-->
                                        <input type="hidden" name="userNo" value="1">
                                        <input type="hidden" name="postNo" value="${content.postNo}">
                                        <input type="hidden" name="isChosen" value="0">
                                        <button class="input-button" type="submit">입력</button>
                                    </form>
                                    <div class="comment-list">
                                        <!-- 각 댓글을 개별적인 div 요소로 표시 -->
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
                    `;
            containerWrap.appendChild(itemElement);

            //나눔 완료 상태
            if (content.postStatus === '1') {
                $('.container').find('#pay').removeClass('hidden')
                $('.container').find('#state').text('나눔 완료')
                $('.container').find('#state').css('color', 'green')
            }
        });
}