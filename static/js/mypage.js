// 전역 변수 //
const back_base_url = 'http://127.0.0.1:8000/'
const front_base_url = 'http://127.0.0.1:5500/templates/'


// 로그인한 user.id 찾는 함수 //
function parseJwt(token) {
  var base64Url = localStorage.getItem("access").split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};


// 나의 북마크 //
function bookmark_info(id, username, title, content, comments, image) {
  temp_html = `
          <li>
          <div class="card" style="width: 18rem;" id="${id}" onClick="open_modal(this.id)">
          <div class="card-img" style="background: 
          url(${back_base_url}${image}) no-repeat center center/contain;">
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
          <i class="far fa-heart heart${id}" style="font-size:24px" onclick="post_like(${id})"><span></span></i>
          <span></span>
          <i class="fa fa-bookmark-o bookmark${id}" style="font-size:24px" onclick="post_bookmark(${id})"></i>
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
          <div class="popup-img" style="background: url(${back_base_url}${image}) no-repeat center center/contain;">
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
          </div>
          </div>
          </li> 
          `
  $('#mypage_card').append(temp_html)

  // 댓글
  for (let j = 0; j < comments.length; j++) {
    let time_post = new Date(comments[j].modlfied_time)
    let time_before = time2str(time_post)
    console.log("댓글 time post :", time_post)

    $(`#comment${id}`).append(`<p>${comments[j].username} : ${comments[j].content}
          &nbsp &nbsp &nbsp &nbsp &nbsp
          ${time_before}&nbsp&nbsp<i onclick="delete_comment(${comments[j].id})" class="fa-regular fa-trash-can"></i></p>
          <hr>`)
  }
}

function bookmark() {
  var token = localStorage.getItem("access")
  $.ajax({
    type: 'GET',
    url: `${back_base_url}article/mybookmark/`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },

    success: function (response) {
      console.log(response)
      for (let i = 0; i < response.length; i++) {
        bookmark_info(
          response[i].id,
          response[i].username,
          response[i].title,
          response[i].content,
          response[i].comments,
          // response[i].bookmarks,
          response[i].image,
          response[i].modlfied_time
        )
      }
    }
  })
};


// 마이 페이지 //
function append_mypage_html(id, username, title, content, comments, likes, bookmarks, image) {
  temp_html = `
      <li>
      <div class="card" style="width: 18rem;" id="${id}" onClick="open_modal(this.id)">
      <div class="card-img" style="background: 
      url(${back_base_url}${image}) no-repeat center center/contain;">
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
      <i class="far fa-heart heart${id}" style="font-size:24px" onclick="post_like(${id})"><span></span></i>
      <span></span>
      <i class="fa fa-bookmark-o bookmark${id}" style="font-size:24px" onclick="post_bookmark(${id})"></i>
      </div>
      
      <!-- 게시글 상세페이지 모달 -->
      <div class="popup-wrap" id="popup${id}">
      <div class="popup">
      
      <!-- 게시글 상세페이지 모달창 헤더 : 수정 및 삭제 -->
      <div class="popup-header">
      <span></span>
      <i type="dutton" onclick="edit_article(${id})" class="fa-solid fa-pen-to-square"></i>
      <i type="dutton" onclick="delete_article(${id})" class="fa-solid fa-trash-can"></i>
      <span></span>
      <i type="dutton" id="1${id}" onClick="close_modal(this.id)" class="popup-close fa-solid fa-square-xmark"></i>
      </div>
      
      <!-- 게시글 상세페이지 모달창 바디 -->
      <div class="popup-body">
      <div class="popup-img" style="background: url(${back_base_url}${image}) no-repeat center center/contain;">
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
      </div>
      </div>
      </li> 
      `
  $('#mypage_card').append(temp_html)

  // 댓글 //
  for (let j = 0; j < comments.length; j++) {
    let time_post = new Date(comments[j].modlfied_time)
    let time_before = time2str(time_post)
    console.log("댓글 time post :", time_post)

    $(`#comment${id}`).append(`<p>${comments[j].username} : ${comments[j].content}
            &nbsp &nbsp &nbsp &nbsp &nbsp
            ${time_before}&nbsp&nbsp<i onclick="delete_comment(${comments[j].id})" class="fa-regular fa-trash-can"></i></p>
            <hr>`)
  }

  // 좋아요 //
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

  // 북마크 //
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


// 내가 작성한 게시글 조회 //
function mypage() {
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
        console.log('for 문 :', response[i])
      
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



//게시글 삭제 //
async function delete_article(id) {
  const response = await fetch(`${back_base_url}article/${id}`, {
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
    alert("게시글 작성자만 삭제 가능합니다.")
  }
}