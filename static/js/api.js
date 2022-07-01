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

// getUser()