let selectedUser = "وحید";

const scriptURL = "https://script.google.com/macros/s/AKfycbzO-qbaGL7exKDRrRZQVTkniY4lC6wH0E38ri5Cp8OWwL3NKwXL0Xlad8_bdSSP3Pj7/exec";

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
// فیلدها
// =========================

const amountInput = document.getElementById("amount");
const weightInput = document.getElementById("weight");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");


// =========================
// محاسبه قیمت هر گرم 750
// =========================

function getGram750(price) {

    return (price / 4.6083) * (750 / 705);

}


// =========================
// محاسبه بر اساس مبلغ + مظنه
// =========================

function calculateWeight() {

    const amount = Number(amountInput.value);
    const price = Number(priceInput.value);

    if (
        amount > 0 &&
        price > 0
    ) {

        const gramPrice = getGram750(price);

        const weight = amount / gramPrice;

        weightInput.value = weight.toFixed(3);

    }

}


// =========================
// محاسبه بر اساس وزن + مظنه
// =========================

function calculateAmount() {

    const weight = Number(weightInput.value);
    const price = Number(priceInput.value);

    if (
        weight > 0 &&
        price > 0
    ) {

        const gramPrice = getGram750(price);

        const amount = weight * gramPrice;

        amountInput.value = Math.round(amount);

    }

}


// =========================
// وقتی از مبلغ خارج شد
// =========================

amountInput.addEventListener("blur", () => {

    const weight = Number(weightInput.value);

    if (!weight) {

        calculateWeight();

    }

});


// =========================
// وقتی از وزن خارج شد
// =========================

weightInput.addEventListener("blur", () => {

    const amount = Number(amountInput.value);

    if (!amount) {

        calculateAmount();

    }

});


// =========================
// وقتی از مظنه خارج شد
// =========================

priceInput.addEventListener("blur", () => {

    const amount = Number(amountInput.value);
    const weight = Number(weightInput.value);


    // مبلغ و مظنه → وزن

    if (
        amount > 0 &&
        !weight
    ) {

        calculateWeight();

    }


    // وزن و مظنه → مبلغ

    else if (
        weight > 0 &&
        !amount
    ) {

        calculateAmount();

    }

});


// =========================
// ثبت اطلاعات
// =========================

document.querySelector(".save").onclick = async () => {

    const description =
        document.getElementById("description").value;

    const amount =
        amountInput.value;

    const weight =
        weightInput.value;

    const price =
        priceInput.value;


    if (
        description.trim() === "" ||
        amount === ""
    ) {

        alert("شرح و مبلغ را وارد کنید");

        return;

    }


    const now = new Date();

    let imageData = "";

    if (imageInput.files.length > 0) {

        const file = imageInput.files[0];

        imageData = await fileToBase64(file);

    }

    const trade = {

        id: Date.now(),

        user: selectedUser,

        operation: selectedOperation,

        description: description,

        amount: amount,

        weight: weight,

        price: price,

        image: imageData,

        date: now.toLocaleDateString("fa-IR"),

        time: now.toLocaleTimeString("fa-IR")

    };


    // =========================
    // ارسال به Google Sheet
    // =========================

    console.log("TRADE SENT:", trade);
    console.log("WEIGHT VALUE:", weightInput.value);
    console.log("PRICE VALUE:", priceInput.value);
    
    fetch(scriptURL, {

        method: "POST",

        body: JSON.stringify(trade)

    })

    .then(response => response.json())

    .then(result => {

        alert("ثبت آنلاین انجام شد");

    })

    .catch(error => {

        console.log(error);

        alert("خطا در ارسال اطلاعات");

    });


    // =========================
    // ذخیره محلی
    // =========================

    let trades =
        JSON.parse(localStorage.getItem("trades")) || [];

    trades.push(trade);

    localStorage.setItem(
        "trades",
        JSON.stringify(trades)
    );


    showTrades();


    // =========================
    // پاک کردن فرم
    // =========================

    document.getElementById("description").value = "";

    amountInput.value = "";

    weightInput.value = "";

    priceInput.value = "";

};


// =========================
// نمایش ثبت‌های قبلی
// =========================

function showTrades() {

    const list =
        document.getElementById("list");

    const trades =
        JSON.parse(localStorage.getItem("trades")) || [];


    if (trades.length === 0) {

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
                    ${
                        t.weight
                        ? Number(t.weight).toLocaleString("fa-IR")
                        : "—"
                    }
                    گرم
                </div>

                <div>
                    📊 مظنه:
                    ${
                        t.price
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

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            resolve(reader.result);

        };

        reader.onerror = error => {

            reject(error);

        };

        reader.readAsDataURL(file);

    });

}