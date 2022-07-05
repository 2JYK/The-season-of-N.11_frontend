// 전역 변수 //
const back_base_url = 'http://127.0.0.1:8000/'
const front_base_url = 'http://127.0.0.1:5500/templates/'


// 로그인한 user.id 찾는 함수 //
function parseJwt(token) {
    var base64Url = localStorage.getItem("access").split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(
        function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    return JSON.parse(jsonPayload);
};


// 북마크 append 부분 //
function bookmark_info(id, username, title, content, comments, image) {
    temp_html = `
    <li>
        <div class="card-box">
            <div class="card" id="${id}" onClick="open_modal(this.id)">
                <div class="card-img" style="background: url(${back_base_url}${image}) no-repeat center center/contain;"></div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <hr>
                    <p class="card-text">${content}</p>
                </div>
                <div class="icons">
                    <i class="far fa-heart heart${id}" style="font-size:24px" onclick="post_like(${id})"><span></span></i>
                    <span></span>
                    <i class="fa fa-bookmark-o bookmark${id}" style="font-size:24px" onclick="post_bookmark(${id})"></i>
                </div>
            </div>

            <!-- 게시글 상세페이지 모달 -->
            <div class="popup-wrap" id="popup${id}">
                <div class="popup">
                    <!-- 게시글 상세페이지 모달창 헤더 -->
                    <div class="popup-header">
                        <span></span>
                        <h2>${username} 님의 게시물</h2>
                        <span></span>
                        <i type="dutton" id="1${id}" onClick="close_modal(this.id)" class="popup-close fa-solid fa-square-xmark"></i>
                    </div>

                    <!-- 게시글 상세페이지 모달창 바디 -->
                    <div class="popup-body">
                        <div class="popup-img"style="background: url(${back_base_url}${image}) no-repeat center center/contain;"></div>
                        <h2 class="popup-title">${title}</h2>
                        <hr>
                        <h5 class="popup-content">${content}</h5>
                        <hr>
                    </div>

                    <!-- 게시글 상세페이지 모달창 댓글 input -->
                    <div class="popup-post-comment">
                        <input class="popup-post-input" id="comment_input${id}" type="text" placeholder="댓글을 입력 해주세요..." />
                        <button class="popup-post-input-btn" onclick="post_comment(${id})">저장</button>
                    </div>
                    <!-- 게시글 상세페이지 모달창 댓글 output -->
                    <div class="popup-comment" id="comment${id}">
                    </div>
                </div>
            </div>
        </div>
    </li>`

    $('#mypage_card').append(temp_html)

    // 댓글
    for (let j = 0; j < comments.length; j++) {
        let time_post = new Date(comments[j].modlfied_time)
        let time_before = time2str(time_post)

        $(`#comment${id}`).append(`<p>${comments[j].username} : ${comments[j].content}
            &nbsp &nbsp &nbsp &nbsp &nbsp
            ${time_before}&nbsp&nbsp<i onclick="delete_comment(${comments[j].id})" class="fa-regular fa-trash-can"></i></p>
            <hr>`)
    }
}

// 북마크 data GET API//
function bookmark() {
    $('#mypage_card').empty()
    var token = localStorage.getItem("access")
    $.ajax({
        type: 'GET',
        url: `${back_base_url}article/mybookmark/`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                bookmark_info(
                    response[i].id,
                    response[i].username,
                    response[i].title,
                    response[i].content,
                    response[i].comments,
                    response[i].image,
                    response[i].modlfied_time
                )
            }
        }
    })
};


// 나의 게시글 append 부분 //
function append_mypage_html(id, username, title, content, comments, likes, bookmarks, image) {
    $('.popup-comment').empty()
    temp_html = `
    <li>
        <div class="card-box">
            <div class="card" id="${id}" onClick="open_modal(this.id)">
                <div class="card-img" style="background: url(${back_base_url}${image}) no-repeat center center/contain;"></div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <hr>
                    <p class="card-text">${content}</p>
                </div>
                <div class="icons">
                    <i class="far fa-heart heart${id}" style="font-size:24px" onclick="post_like(${id})"><span></span></i>
                    <span></span>
                    <i class="fa fa-bookmark-o bookmark${id}" style="font-size:24px" onclick="post_bookmark(${id})"></i>
                </div>
            </div>

            <!-- 게시글 상세페이지 모달 -->
            <div class="popup-wrap" id="popup${id}">
                <div class="popup">
                    <!-- 게시글 상세페이지 모달창 헤더 : 수정 및 삭제 -->
                    <div class="popup-header">
                        <span></span>
                        <i type="button" id="update_button(${id})" onclick="edit_article(${id})" class="fa-solid fa-pen-to-square"></i>
                        <i type="button" onclick="delete_article(${id})" class="fa-solid fa-trash-can"></i>
                        <span></span>
                        <i type="button" id="1${id}" onClick="close_modal(this.id)" class="popup-close fa-solid fa-square-xmark"></i>
                    </div>

                    <!-- 게시글 상세페이지 모달창 바디 -->
                    <div class="popup-body">
                        <div class="popup-img" style="background: url(${back_base_url}${image}) no-repeat center center/contain;"></div>
                        <!-- 게시글 수정 구간 -->
                        <div id="edit(${id})">
                            <h2 class="popup-title" id="title(${id})">${title}</h2>
                            <hr>
                            <h5 class="popup-content" id="content(${id})">${content}</h5>
                            <hr>
                        </div>
                    </div>

                    <!-- 게시글 상세페이지 모달창 댓글 input -->
                    <div class="popup-post-comment">
                        <input class="popup-post-input" id="comment_input${id}" type="text" placeholder="댓글을 입력 해주세요..." />
                        <button class="popup-post-input-btn" onclick="post_comment(${id})">저장</button>
                    </div>
                    <!-- 게시글 상세페이지 모달창 댓글 output -->
                    <div class="popup-comment" id="comment${id}">
                    </div>
                </div>
            </div>
        </div>
    </li>`

    $('#mypage_card').append(temp_html)

    // 댓글
    for (let j = 0; j < comments.length; j++) {
        let time_post = new Date(comments[j].modlfied_time)
        let time_before = time2str(time_post)

        $(`#comment${id}`).append(`<p>${comments[j].username} : ${comments[j].content}
            &nbsp &nbsp &nbsp &nbsp &nbsp
            ${time_before}&nbsp&nbsp<i onclick="delete_comment(${comments[j].id})" class="fa-regular fa-trash-can"></i></p>
            <hr>`)
    }

    // 좋아요 //
    for (let l = 0; l < likes.length; l++) {
        // 로그인한 유저 ID
        let now_user_id = parseJwt('access').user_id

        // like 테이블 유저 ID
        let like_user_id = `${likes[l].user}`
        like_user_id = parseInt(like_user_id.slice(0, 3))

        // 게시글 ID
        let article_id = `${id}`
        article_id = parseInt(article_id.slice(0, 3))

        // like 테이블 게시글 ID
        let like_article_id = `${likes[l].article}`
        like_article_id = parseInt(like_article_id.slice(0, 3))

        if (now_user_id == like_user_id && article_id == like_article_id) {
            // $(".클래스 이름").attr("class","변경 할 클래스명");
            $(`.heart${id}`).css("color", "red");
            $(`.heart${id}`).addClass("fa");
            $(`.heart${id}`).removeClass("far");
        }
    }

    // 북마크 //
    for (let m = 0; m < bookmarks.length; m++) {
        let now_user_id = parseJwt('access').user_id

        let bookmark_user_id = `${bookmarks[m].user}`
        bookmark_user_id = parseInt(bookmark_user_id.slice(0, 3))

        let article_id = `${id}`
        article_id = parseInt(article_id.slice(0, 3))

        let bookmark_article_id = `${bookmarks[m].article}`
        bookmark_article_id = parseInt(bookmark_article_id.slice(0, 3))

        if (now_user_id == bookmark_user_id && article_id == bookmark_article_id) {
            // $(".클래스 이름").attr("class","변경 할 클래스명");
            $(`.bookmark${id}`).css("color", "blue");
            $(`.bookmark${id}`).addClass("fa-bookmark");
            $(`.bookmark${id}`).removeClass("fa-bookmark-o");
        }
    }
}


// 내가 작성한 게시글 조회 //
function mypage() {
    $('#mypage_card').empty()
    var token = localStorage.getItem("access")
    $.ajax({
        type: 'GET',
        url: `${back_base_url}article/mypage/`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                append_mypage_html(
                    response[i].id,
                    response[i].username,
                    response[i].title,
                    response[i].content,
                    response[i].comments,
                    response[i].likes,
                    response[i].bookmarks,
                    response[i].image
                )
            }
        }
    });
} mypage()


// 게시글 수정버튼 -> 수정 상태로 변경 //
function edit_article(id) {
    const title = document.getElementById(`title(${id})`)
    const content = document.getElementById(`content(${id})`)

    title.style.visibility = "hidden"
    content.style.visibility = "hidden"

    const input_title = document.createElement("textarea")
    input_title.setAttribute("id", "input_title")
    input_title.innerText = title.innerHTML

    const input_content = document.createElement("textarea")
    input_content.setAttribute("id", "input_content")
    input_content.innerText = content.innerHTML
    input_content.rows = 10

    const body = document.getElementById(`edit(${id})`)
    body.insertBefore(input_title, title)
    body.insertBefore(input_content, content)

    const update_button = document.getElementById(`update_button(${id})`)
    update_button.setAttribute("onclick", `updateArticle(${id})`)
}


// 게시글 업데이트 정보 전달 //
async function updateArticle(id) {
    var input_title = document.getElementById("input_title")
    var input_content = document.getElementById("input_content")

    const article = await patchArticle(id, input_title.value, input_content.value);
}


// 게시글 수정 -> 수정 내용 적용 //
async function patchArticle(article_id, title, content) {
    const articleData = {
        "title": title,
        "content": content
    }

    const response = await fetch(`${back_base_url}article/${article_id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(articleData)
    }
    )

    if (response.status == 200) {
        window.location.reload();
    } else {
        alert("게시글 작성자만 수정 가능합니다.")
    }
}


// 게시글 삭제 //
async function delete_article(article_id) {
    const response = await fetch(`${back_base_url}article/${article_id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        method: 'DELETE'
    })

    if (response.status == 200) {
        window.location.reload();
    } else {
        alert("게시글 작성자만 삭제 가능합니다.")
    }
}