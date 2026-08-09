let selectedUser = "وحید";

const scriptURL = "https://script.google.com/macros/s/AKfycbzxBc1bfPhfbW3JURTLSl6A9tkWIv4btK9y1XSSqd8gickVylKI4xVt_CbH1ZQpidMw/exec";

let selectedOperation = "خرید";


// =========================
// انتخاب ثبت کننده
// =========================

const users = document.querySelectorAll(".user");

users.forEach(btn => {

    btn.onclick = () => {

        users.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        selectedUser = btn.innerText;

    };

});


// =========================
// انتخاب نوع عملیات
// =========================

const operations = document.querySelectorAll(".operation");

operations.forEach(btn => {

    btn.onclick = () => {

        operations.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        selectedOperation = btn.innerText;

    };

});


// =========================
// ثبت اطلاعات
// =========================

document.querySelector(".save").onclick = () => {

    let description =
        document.getElementById("description").value;

    let amount =
        document.getElementById("amount").value;

    let weight =
        document.getElementById("weight").value;

    let price =
        document.getElementById("price").value;


    // شرح و مبلغ الزامی هستند
    if(description.trim() == "" || amount == "") {

        alert("شرح و مبلغ را وارد کنید");

        return;

    }


    let now = new Date();


    let trade = {

        id: Date.now(),

        user: selectedUser,

        operation: selectedOperation,

        description: description,

        amount: amount,

        weight: weight,

        price: price,

        date: now.toLocaleDateString("fa-IR"),

        time: now.toLocaleTimeString("fa-IR")

    };


    // ارسال به Google Sheet

    fetch(scriptURL, {

        method: "POST",

        body: JSON.stringify(trade)

    })


    .then(response => response.json())


    .then(result => {

        alert("ثبت آنلاین انجام شد");

    })


    .catch(error => {

        alert("خطا در ارسال اطلاعات");

        console.log(error);

    });


    // ذخیره محلی گوشی

    let trades =
        JSON.parse(localStorage.getItem("trades")) || [];


    trades.push(trade);


    localStorage.setItem(
        "trades",
        JSON.stringify(trades)
    );


    showTrades();


    // پاک کردن فرم

    document.getElementById("description").value = "";

    document.getElementById("amount").value = "";

    document.getElementById("weight").value = "";

    document.getElementById("price").value = "";

};


// =========================
// نمایش ثبت‌های قبلی
// =========================

function showTrades() {

    let list =
        document.getElementById("list");

    let trades =
        JSON.parse(localStorage.getItem("trades")) || [];


    if(trades.length == 0) {

        list.innerHTML =
            "هنوز اطلاعاتی ثبت نشده";

        return;

    }


    list.innerHTML = "";


    trades
        .slice()
        .reverse()
        .forEach(t => {


        list.innerHTML += `

        <div class="trade-item">

            <div>
                <strong>${t.operation}</strong>
            </div>

            <div>
                👤 ${t.user}
            </div>

            <div>
                ${t.description}
            </div>

            <div>
                💰 ${Number(t.amount).toLocaleString("fa-IR")} تومان
            </div>

            <div>
                ⚖️ وزن:
                ${t.weight
                    ? Number(t.weight).toLocaleString("fa-IR")
                    : "—"
                }
                گرم
            </div>

            <div>
                📊 مظنه:
                ${t.price
                    ? Number(t.price).toLocaleString("fa-IR")
                    : "—"
                }
            </div>

            <div>
                📅 ${t.date}
            </div>

            <div>
                ⏰ ${t.time}
            </div>

        </div>

        `;

    });

}


// اجرای اولیه

showTrades();