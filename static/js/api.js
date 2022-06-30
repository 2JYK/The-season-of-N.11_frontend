// 전역 변수
const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"


function show_posting() {
    $.ajax({
        type: 'GET',
        url: `${backend_base_url}article/`,
        data: {},
        success: function (response) {
            let postings = response
            console.log("13 :", response)
            for (let i = 0; i < postings.length; i++) {
                console.log('15 번 title :',postings[i].title)
                console.log('16 번 content :',postings[i].content)
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