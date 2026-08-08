let selectedUser = "وحید";
const scriptURL = "https://script.google.com/macros/s/AKfycbzxBc1bfPhfbW3JURTLSl6A9tkWIv4btK9y1XSSqd8gickVylKI4xVt_CbH1ZQpidMw/exec";
let selectedOperation = "خرید";


// انتخاب ثبت کننده

const users = document.querySelectorAll(".user");

users.forEach(btn => {

    btn.onclick = () => {

        users.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        selectedUser = btn.innerText;

    };

});



// انتخاب نوع عملیات

const operations = document.querySelectorAll(".operation");


operations.forEach(btn => {

    btn.onclick = () => {

        operations.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        selectedOperation = btn.innerText;

    };

});




// ثبت اطلاعات

document.querySelector(".save").onclick = () => {


let description =
document.getElementById("description").value;


let amount =
document.getElementById("amount").value;


let price =
document.getElementById("price").value;



if(description.trim()=="" || amount==""){

    alert("شرح و مبلغ را وارد کنید");

    return;

}



let trade = {


id: Date.now(),

user:selectedUser,

operation:selectedOperation,

description:description,

amount:amount,

price:price,

date:new Date().toLocaleDateString("fa-IR"),

time:new Date().toLocaleTimeString("fa-IR")


};



fetch(scriptURL, {

    method: "POST",

    body: JSON.stringify(trade)

})

.then(response => response.json())

.then(result => {

    alert("ثبت آنلاین انجام شد");

    showTrades();

})

.catch(error => {

    alert("خطا در ارسال اطلاعات");

    console.log(error);

});



showTrades();



document.getElementById("description").value="";

document.getElementById("amount").value="";

document.getElementById("price").value="";


alert("ثبت شد");


};





function showTrades(){


let list =
document.getElementById("list");


let trades =
JSON.parse(localStorage.getItem("trades")) || [];



if(trades.length==0){

list.innerHTML="هنوز اطلاعاتی ثبت نشده";

return;

}



list.innerHTML="";



trades.reverse().forEach(t=>{


list.innerHTML += `

<div style="
background:#292929;
padding:12px;
border-radius:10px;
margin-bottom:10px;
">

<b>${t.operation}</b>

<br>

👤 ${t.user}

<br>

${t.description}

<br>

💰 ${Number(t.amount).toLocaleString("fa-IR")} تومان

<br>

📅 ${t.date}

&nbsp;

⏰ ${t.time}

</div>

`;


});


}



showTrades();