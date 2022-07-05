// 전역 변수 //
const backend_base_url = 'http://127.0.0.1:8000/'
const frontend_base_url = 'http://127.0.0.1:5500/templates/'


// 회원가입 //
async function handleSignup() {
    const signupData = {
        username: document.getElementById("floatingInput").value,
        password: document.getElementById("floatingPassword").value,
        email: document.getElementById("floatingInputEmail").value,
        fullname: document.getElementById("floatingInputFullname").value,
    }

    const response = await fetch(`${backend_base_url}user/`, {
        headers: {
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(signupData)
    })

    response_json = await response.json()

    if (response.status == 200) {
        window.location.replace(`${frontend_base_url}login.html`)
    } else {
        alert("조건에 맞춰 입력해주세요.")
    }
}


// 로그인 //
async function handleLogin() {
    const loginData = {
        username: document.getElementById("floatingInput").value,
        password: document.getElementById("floatingPassword").value,
    }

    const response = await fetch(`${backend_base_url}user/api/season/token/`, {
        headers: {
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(loginData)
    })

    response_json = await response.json()

    if (response.status == 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(
            function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

        localStorage.setItem("payload", jsonPayload);
        window.location.replace(`${frontend_base_url}index.html`)
    } else {
        alert("잘못된 로그인입니다.", response.status)
    }
}


// 로그아웃 //
async function logout() {
    localStorage.removeItem('payload')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')

    window.location.replace(`${frontend_base_url}login.html`)
}


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


// 댓글 시간 나타내기 //
function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간

    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24

    if (time < 7) {
        return parseInt(time) + "일 전"
    }

    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
};


// 모달 제어 //
function open_modal(id) {
    //팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
    $("#popup" + id).css('display', 'flex').hide().fadeIn();
}


function close_modal(id) {
    // id 파라미터가 str값 으로 넘어와서 slice하고 int로 변환
    change_to_int = parseInt(id.slice(1))

    function modal_close() {
        $("#popup" + change_to_int).fadeOut();
    }

    $("#close" + change_to_int)
    modal_close(); //모달 닫기
}
// 모달 끝 //


// article, comment GET API //
function show_article() {
    $.ajax({
        type: 'GET',
        url: `${backend_base_url}article/`,
        data: {},
        success: function (response) {
            let postings = response
            for (let i = 0; i < postings.length; i++) {
                append_temp_html(
                    postings[i].id,
                    postings[i].username,
                    postings[i].title,
                    postings[i].content,
                    postings[i].comments,
                    postings[i].likes,
                    postings[i].bookmarks,
                    postings[i].image
                )
            }
            function append_temp_html(id, user, title, content, comments, likes, bookmarks, image) {
                temp_html = `
            <li>
                <div class="card-box">
                    <!-- 게시글 -->
                    <div class="card" id="${id}" onClick="open_modal(this.id)">
                        <div class="card-img" style="background: url(${backend_base_url}${image}) no-repeat center center/contain;"></div>
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <hr>
                            <p class="card-text">${content}</p>
                        </div>
                        <div class="icons">
                            <i class="far fa-heart heart${id}" style="font-size:24px" onclick="post_like(${id})"><span>${likes.length}</span></i>
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
                                <h2>${user} 님의 게시물</h2>
                                <span></span>
                                <i type="dutton" id="1${id}" onClick="close_modal(this.id)" class="popup-close fa-solid fa-square-xmark"></i>
                            </div>
                    
                            <!-- 게시글 상세페이지 모달창 바디 -->
                            <div class="popup-body">
                                <div class="popup-img" style="background: url(${backend_base_url}${image}) no-repeat center center/contain;">
                            </div>
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
            </li>`

                $('#card').append(temp_html)

                // 댓글
                for (let j = 0; j < comments.length; j++) {
                    let time_post = new Date(comments[j].modlfied_time)
                    let time_before = time2str(time_post)

                    $(`#comment${id}`).append(`<p>${comments[j].username} : ${comments[j].content}
                        &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                        ${time_before}&nbsp&nbsp<i onclick="delete_comment(${comments[j].id})" class="fa-regular fa-trash-can"></i></p>
                        <hr>`)
                }

                // 좋아요
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

                // 북마크
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
        }
    });
} show_article()


// 이미지 스타일 모델 적용 //
var imgs = document.querySelectorAll("#style-imgs .imgs");
for (var i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener("click", click);
}
function click(e) {
    sessionStorage.setItem('model', this.alt)
}


// 게시글 작성 //
async function post_article() {
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value
    const style = sessionStorage.getItem('model') // click(e)에서 생성된 model
    const input = document.getElementById("fileUpload").files

    // back-end에서 데이터를 받을 때 사용하는 변수명을 사용해야 함
    const formData = new FormData()
    formData.append('input', input[0])
    formData.append('title', title)
    formData.append('content', content)
    formData.append('style', style)

    const response = await fetch(`${backend_base_url}article/`, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + localStorage.getItem("access")
        },
        method: 'POST',
        body: formData
    })

    if (response.status == 200) {
        window.location.replace(`${frontend_base_url}`);
    } else {
        alert(response.status);
    }
}


// 댓글 작성 //
async function post_comment(id) {
    const content = document.getElementById("comment_input" + id).value
    const commentData = {
        "article": id,
        "content": content
    }

    const response = await fetch(`${backend_base_url}article/comment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(commentData)
    })

    if (response.status == 200) {
        window.location.reload();
        return response
    } else {
        alert(response.status)
    }
}


// 댓글 삭제 //
async function delete_comment(id) {
    const response = await fetch(`${backend_base_url}article/comment/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        method: 'DELETE'
    })

    if (response.status == 200) {
        window.location.reload();
    } else {
        alert("댓글 작성자만 삭제 가능합니다.")
    }
}


// 북마크
async function post_bookmark(id) {
    const bookmarkData = {
        "article": id,
    }
    const response = await fetch(`${backend_base_url}article/bookmark/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(bookmarkData)
    })

    response_json = await response.json()

    if (response.status == 200) {
        alert("북마크가 되었습니다!")
        window.location.reload()
        return response
    } else {
        alert("북마크가 취소되었습니다!")
        window.location.reload()
    }
}


// 좋아요
async function post_like(id) {
    const likeData = {
        "article": id,
    }
    const response = await fetch(`${backend_base_url}article/like/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(likeData)
    })

    response_json = await response.json()

    if (response.status == 200) {
        alert("좋아요가 반영되었습니다!")
        window.location.reload()
        return response
    } else {
        alert("좋아요를 취소하셨습니다!")
        window.location.reload()
    }
}