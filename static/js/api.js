// 전역 변수
const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"

function open_modal(id) {
  $("#popup" + id).css('display', 'flex').hide().fadeIn();
  //팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
}

function close_modal(id) {
  // id 파라미터가 str값 으로 넘어와서 slice하고 int로 변환
  a = parseInt(id.slice(1))

  function modal_close() {
    $("#popup" + a).fadeOut(); //페이드아웃
  }

  $("#close" + a)
  modal_close(); //모달 닫기);
}

function show_article() {
  $.ajax({
    type: 'GET',
    url: `${backend_base_url}article/`,
    data: {},
    success: function (response) {
      console.log(response)
      let postings = response
      for (let i = 0; i < postings.length; i++) {

        
        // console.log('ID ', postings[i].id)
        // console.log('article ', postings[i].title)
        // console.log('comments', comment[j].content)
        
        append_temp_html(
          postings[i].id,
          postings[i].username,
          postings[i].title,
          postings[i].content,
          postings[i].comments
          // comment[j].username,
          // comment[j].content,
          // postings[i].img
          )
        }
        function append_temp_html(id, user, title, content, comments, img) {
          temp_html =`
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

                    for (let j = 0; j < comments.length; j++){
                      $(`#comment${id}`).append(`
                      <p>${comments[j].username} : ${comments[j].content}</p>
                      <hr>
                      `)
                    }
                  }
                }
              });
            } show_article()


// 게시글 작성
async function post_article() {
  const title = document.getElementById("title").value
  const content = document.getElementById("content").value
              
  const articleData = {
    title: title,
    content: content,
  }
  console.log(articleData)

  const response = await fetch(`${backend_base_url}article/`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("token")
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


//댓글 작성
async function post_comment() {
  const comment_content = document.getElementById("input_comment")
  const commentData = {
    "content": comment_content
  }
  const response = await fetch(`${backend_base_url}article/comment`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("token")
    },
    method: 'POST',
    body: JSON.stringify(commentData)
  }
  )

  if (response.status == 200) {
    return response
  } else {
    alert(response.status)
  }


}