// signup //
let id = document.querySelector('#floatingInput')
let email = document.querySelector('#floatingInputEmail')
let fullname = document.querySelector('#floatingInputFullname')
let pw = document.querySelector('#floatingPassword')

let btn = document.querySelector('#signupbtn')
let label;

btn.addEventListener('click', () => {
    if (id.value == "") {
        label = id.nextElementSibling
        label.classList.add('warning')
        setTimeout(() => {
            label.classList.remove('warning')
        }, 1500)

    } else if (email.value == "") {
        label = email.nextElementSibling
        label.classList.add('warning')
        setTimeout(() => {
            label.classList.remove('warning')
        }, 1500)
        
    } else if (fullname.value == "") {
        label = fullname.nextElementSibling
        label.classList.add('warning')
        setTimeout(() => {
            label.classList.remove('warning')
        }, 1500)   

    } else if (pw.value == "") {
        label = pw.nextElementSibling
        label.classList.add('warning')
        setTimeout(() => {
            label.classList.remove('warning')
        }, 1500)
    }
})