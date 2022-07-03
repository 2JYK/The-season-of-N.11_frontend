// 전역 변수
const backend_base_url = 'http://127.0.0.1:8000'
const frontend_base_url = 'http://127.0.0.1:5500/templates'

// 회원가입 //
async function handleSignup() {
    const signupData = {
        username: document.getElementById("floatingInput").value,
        password: document.getElementById("floatingPassword").value,
        email: document.getElementById("floatingInputEmail").value,
        fullname: document.getElementById("floatingInputFullname").value,
    }

    const response = await fetch(`${backend_base_url}/user/`, {
        headers: {
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(signupData)
    })

    response_json = await response.json()

    if (response.status == 200) {
        console.log("여기", response_json)
        window.location.replace(`${frontend_base_url}/login.html`)
    } else {
        console.log("여기11", response_json)
        alert(response.status)
    }
}

// 로그인 //
async function handleLogin() {
    const loginData = {
        username: document.getElementById("floatingInput").value,
        password: document.getElementById("floatingPassword").value,
    }

    const response = await fetch(`${backend_base_url}/user/api/season/token/`, {
        headers: {
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(loginData)
    })

    response_json = await response.json()
    console.log(response_json.access)

    if (response.status == 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        window.location.replace(`${frontend_base_url}/index.html`)
    } else {
        alert(response.status)
    }
}

// 로그아웃 //
async function logout() {
    localStorage.removeItem('payload')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')

    window.location.replace(`${frontend_base_url}/login.html`)
}


// async function getUser() {
//     const response = await fetch(`${backend_base_url}/user/`, {
//         headers: {
//             'Authorization': localStorage.getItem('access')
//         }
//     })
//     console.log(response)

//     if (response.status == 200) {
//         response_json = await response.json()
//         console.log(response_json)
//         return response_json
//     } else {
//         return null
//     }
// }

// 모달 제어
function open_modal(id) {
    $("#popup" + id).css('display', 'flex').hide().fadeIn();
    //팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
}

function close_modal(id) {
    // id 파라미터가 str값 으로 넘어와서 slice하고 int로 변환
    a = parseInt(id.slice(1)) // 변수명 바꿔야 함
    function modal_close() {
        $("#popup" + a).fadeOut(); //페이드아웃
    }

    $("#close" + a)
    modal_close(); //모달 닫기);
}
// 모달 끝

// article, comment GET API
function show_article() {
    $.ajax({
        type: 'GET',
        url: `${backend_base_url}/article/`,
        data: {},
        success: function (response) {
            console.log(response)

            let postings = response
            for (let i = 0; i < postings.length; i++) {
                append_temp_html(
                    postings[i].id,
                    postings[i].username,
                    postings[i].title,
                    postings[i].content,
                    postings[i].comments,
                    postings[i].image
                )
            }
            function append_temp_html(id, user, title, content, comments, image) {
                temp_html = `
          <li>
          <div class="card" style="width: 18rem;" id="${id}" onClick="open_modal(this.id)">
          <div class="card-img" style="background: rgb(192, 236, 155);">
          <!--이미지 삽입 예정-->
          </div>
          <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <hr>
          <p class="card-text">
          ${content}
          </p>
          <div class="icons">
          <i class="far fa-heart" style="font-size:24px"></i>
          <i class="fa fa-bookmark-o" style="font-size:24px"></i>
          </div>
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
              <span id="1${id}" class="popup-close" onClick="close_modal(this.id)"> X </span>
              </div>
              
              <!-- 게시글 상세페이지 모달창 바디 -->
              <div class="popup-body">
              <div class="popup-img" style="background: rgb(141, 206, 214);">
              <!--이미지 삽입 예정-->
                <img id="output-image" src="The-season-of-N.11_backend/${image}" alt="image">
              </div>
              <h2 class="popup-title">
              ${title}
              </h2>
              <hr>
              <h5 class="popup-content">
              ${content}
              </h5>
              <hr>
              </div>
              <!-- 게시글 상세페이지 모달창 댓글 output -->
              <div class="popup-comment" id="comment${id}">
              <h1>댓글 창</h1>
                    <hr>

                      </div>
                      
                      <!-- 게시글 상세페이지 모달창 댓글 input -->
                      <div class="popup-post-comment">
                      <input class="popup-post-input" id="input_comment" type="text" placeholder="댓글을 입력 해주세요..." />
                  <button class="popup-post-input-btn" onclick="save()">
                    저장
                    </button>
                    </div>
                    </div>
                    </div>
                    </li> 
                    `
                $('#card').append(temp_html)
                for (let j = 0; j < comments.length; j++) {
                    $(`#comment${id}`).append(`<p>${comments[j].username} : ${comments[j].content}</p>
                      <hr>`)
                }
            }
        }
    });
} show_article()

function getImageFiles(e) {
    const files = e.currentTarget.files;
    console.log(typeof files, files);
}

// 게시글 작성
async function post_article() {
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value
    const style = document.getElementById('a1').value
    const files = document.getElementById("fileUpload").files

    const formData = new FormData()
    formData.append('myFile', files[0])

    const articleData = {
        title: title,
        content: content,
        style: style,
    }
    console.log(articleData)
    formData.append('articleData', articleData)

    const response = await fetch(`${backend_base_url}/article/`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin':'*',
            // 'Content-Type': 'application/json',
            // 'Content-Type': 'multipart/form-data',
            // 'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("access")
        },
        // body: JSON.stringify(articleData)
        body: formData
    }
    )

    console.log("1", formData)
    response_json = await response.formData()
    console.log(response_json)   
    console.log("2", formData)
    if (response.status == 200) {
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.status)
    }
}


//댓글 작성
async function post_comment() {
    const content = document.getElementById("input_comment").value
    console.log("148", content)
    const commentData = {
        "content": content
    }
    console.log("152", commentData)
    const response = await fetch(`${backend_base_url}/article/comment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(commentData)
    }
    )

    if (response.status == 200) {
        return response
    } else {
        alert(response.status)
    }
}