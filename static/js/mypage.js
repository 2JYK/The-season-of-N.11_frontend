// 전역 변수
const back_base_url = 'http://127.0.0.1:8000'
const front_base_url = 'http://127.0.0.1:5500/templates'


// 로그인한 user.id 찾는 함수
function parseJwt(token) {
  var base64Url = localStorage.getItem("access").split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};


function mypage() {
  var token = localStorage.getItem("access")
  $.ajax({
    type: 'GET',
    url: `${back_base_url}/article/mypage/`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    data: {},
    success: function (response) {
      console.log('1번째로 찍혀야 하는것 :', response)
      let get_mypage = response
      console.log('413 번 Response :', get_mypage) // 여기도 안찍힘
      for (let a = 0; a < get_mypage.length; a++) {
        console.log('for 문 :', get_mypage[a])
      }
    }
  });
} mypage()