// 전역 변수
const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"


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


// Article get //
function show_posting() {
    $.ajax({
        type: 'GET',
        url: `${backend_base_url}article/`,
        data: {},
        success: function (response) {
            let postings = response
            console.log("13 :", response)
            for (let i = 0; i < postings.length; i++) {
                console.log('15 번 title :', postings[i].title)
                console.log('16 번 content :', postings[i].content)
                // postings[i].img


                append_temp_html(
                    postings[i].title,
                    postings[i].content
                    // postings[i].img
                )
            }
            function append_temp_html(title, content, img) {
                temp_html = `
                <li>
                <div class="card" style="width: 18rem;">
                  <div class="card-img" style="background: rgb(192, 236, 155);">
                    <!--이미지 삽입-->
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
              </li>
                `
                $('#card').append(temp_html)
            }
        }
    });
}
show_posting()

