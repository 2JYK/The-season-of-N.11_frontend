// 전역 변수
const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"


// 로그인한 user.id 찾는 함수
function parseJwt(token) {
  var base64Url = localStorage.getItem("access").split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};


// 댓글시간 나타내기
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


// 모달 제어
function open_modal(id) {
  $("#popup" + id).css('display', 'flex').hide().fadeIn();
  //팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
}

function close_modal(id) {
  // id 파라미터가 str값 으로 넘어와서 slice하고 int로 변환
  parse_int = parseInt(id.slice(1)) // 변수명 바꿔야 함
  function modal_close() {
    $("#popup" + parse_int).fadeOut(); //페이드아웃
  }
  $("#close" + parse_int)
  modal_close(); //모달 닫기);
}

function show_article() {
  $.ajax({
    type: 'GET',
    url: `${backend_base_url}article/`,
    data: {},
    success: function (response) {
      let postings = response
      console.log(postings)

      for (let i = 0; i < postings.length; i++) {
        append_temp_html(
          postings[i].id,
          postings[i].username,
          postings[i].title,
          postings[i].content,
          postings[i].comments,
          postings[i].likes,
          postings[i].bookmarks
        )
      }
      function append_temp_html(id, user, title, content, comments, likes, bookmarks, img) {
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
          </div>
          </div>
          
          <div class="icons">
          <i class="far fa-heart heart${id}" style="font-size:24px" onclick="post_like(${id})"><span>${likes.length}</span></i>
          <span></span>
          <i class="fa fa-bookmark-o bookmark${id}" style="font-size:24px" onclick="post_bookmark(${id})"></i>
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
          
          <input class="popup-post-input" id="comment_input${id}" type="text" placeholder="댓글을 입력 해주세요..." />
          <button class="popup-post-input-btn" onclick="post_comment(${id})">
          저장
          </button>
          </div>
          <!--<button class="delete-button" onclick="delete_article(${id})">게시글 삭제</button>-->
          </div>
          </div>
          </li> 
          `
        $('#card').append(temp_html)

        // 댓글
        for (let j = 0; j < comments.length; j++) {
          let time_post = new Date(comments[j].modlfied_time)
          let time_before = time2str(time_post)

          $(`#comment${id}`).append(`<p>${comments[j].username} : ${comments[j].content}
          &nbsp &nbsp &nbsp &nbsp &nbsp
          ${time_before}&nbsp&nbsp<i onclick="delete_comment(${comments[j].id})" class="fa-regular fa-trash-can"></i></p>
          <hr>`)
        }

        // 좋아요
        for (let l = 0; l < likes.length; l++) {

          let now_user_id = parseJwt('access').user_id  // 로그인한 유저 ID
          // console.log('로그인한 유저 ID :', typeof (now_user_id), now_user_id)

          let like_user_id = `${likes[l].user}` // like 테이블 유저 ID
          like_user_id = parseInt(like_user_id.slice(0, 3))
          // console.log('like 테이블 유저 ID 속성 :', typeof (like_user_id), like_user_id)

          let article_id = `${id}`  // 게시글 ID
          article_id = parseInt(article_id.slice(0, 3))
          // console.log('게시글 ID :', typeof (article_id), article_id)

          let like_article_id = `${likes[l].article}` // like 테이블 게시글 ID
          like_article_id = parseInt(like_article_id.slice(0, 3))
          // console.log('like 테이블 게시글 ID :', typeof (like_article_id), like_article_id)

          if (now_user_id == like_user_id && article_id == like_article_id) {
            console.log('ㅡㅡㅡㅡㅡ 성공 ㅡㅡㅡㅡㅡ')
            $(`.heart${id}`).css("color", "red");
            $(`.heart${id}`).addClass("fa");
            $(`.heart${id}`).removeClass("far");
          }
          else {
            console.log('ㅡㅡㅡㅡㅡ 실패 ㅡㅡㅡㅡㅡ')
          }
        }

        // 북마크
        for (let m = 0; m < bookmarks.length; m++) {
          let now_user_id = parseJwt('access').user_id
          console.log("user ID :", now_user_id)

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

// get 방식으로 user_id, article_id 변수로 받고
// like DB안에 정보를 비교

// Ex) 
// if(로그인한 유저 ID == 좋아요한 유저 ID && 게시글 ID == 좋아요 된 게시글 ID)

// if(now_user_id == like_user_id && article_id == like_article) {
//   
//    토클을 색깔 있는걸로 변경
// }
// else {
//   기본 값
// }



// 게시글 작성
async function post_article() {
  const title = document.getElementById("title").value
  const content = document.getElementById("content").value

  const articleData = {
    title: title,
    content: content,
  }

  const response = await fetch(`${backend_base_url}article/`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("access")
    },
    body: JSON.stringify(articleData)
  }
  )

  response_json = await response.json()
  console.log(response_json)

  if (response.status == 200) {
    window.location.replace(`${frontend_base_url}/`);
  } else {
    alert(response.status)
  }
}

// //게시글 삭제
// async function delete_article(id) {
//   const response = await fetch(`${backend_base_url}article/${id}`, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': "Bearer " + localStorage.getItem("access")
//     },
//     method: 'DELETE'

//   }
//   )

//   if (response.status == 200) {
//     window.location.reload();
//   } else {
//     alert("게시글 작성자만 삭제 가능합니다.")
//   }
// }



//댓글 작성
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
  }
  )

  if (response.status == 200) {
    // refresh(id)
    window.location.reload();

    return response

  } else {
    alert(response.status)
  }
}

//댓글 삭제
async function delete_comment(id) {
  const response = await fetch(`${backend_base_url}article/comment/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("access")
    },
    method: 'DELETE'

  }
  )

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
  }
  )
  response_json = await response.json()
  console.log('북마크', response_json)

  if (response.status == 200) {
    alert("북마크가 되었습니다")
    window.location.reload()
    return response

  } else {
    alert("북마크가 취소 되었습니다")
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
  }
  )
  response_json = await response.json()

  if (response.status == 200) {
    alert("좋아요를 하셨습니다")
    window.location.reload()
    return response

  } else {
    alert("좋아요를 취소 하셨습니다.")
    window.location.reload()
  }
}


// 회원가입 //
async function handleSignup() {
  const signupData = {
    username: document.getElementById("floatingInput").value,
    password: document.getElementById("floatingPassword").value,
    email: document.getElementById("floatingInputEmail").value,
    fullname: document.getElementById("floatingInputFullname").value,
  }

  const response = await fetch(`http://127.0.0.1:8000/user/`, {
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
    window.location.replace(`http://127.0.0.1:5500/templates/login.html`)
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

  const response = await fetch(`http://127.0.0.1:8000/user/api/token/`, {
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
    window.location.replace(`http://127.0.0.1:5500/templates/index.html`)
  } else {
    alert(response.status)
  }
}


// 로그아웃 //
async function logout() {
  localStorage.removeItem('payload')
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')

  window.location.replace(`${frontend_base_url}templates/login.html`)
}
