const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");
const countQuestionsSpan = document.getElementById("countQuestionsSpan");
const questionsDiv = document.getElementById("questionsDiv");
const errorQuestionInput = document.getElementById("errorQuestionInput");
const url = "http://127.0.0.1:3000/questions";
submitBtn.setAttribute("disabled", "");
submitBtn.addEventListener("click", () => {
  let questionValue = questionInput.value;
  let answerValue = answerInput.value == "true";
  let dataToSend = {
    question: questionValue,
    answer: answerValue,
  };
  dataToSend = JSON.stringify(dataToSend);
  const xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.addEventListener("load", () => {
    if (xhr.status == 201) {
      let data = JSON.parse(xhr.response);
      addQuestionToDiv(data);
      questionInput.value = "";
    } else {
      alert(xhr.response);
    }
  });
  xhr.addEventListener("error", () => {
    alert("error");
  });
  xhr.send(dataToSend);
});
questionInput.addEventListener("input", () => {
  let value = questionInput.value;
  if (!value) {
    errorQuestionInput.innerText = "question is required";
    return submitBtn.setAttribute("disabled", "");
  }

  if (value.indexOf("?") == -1) {
    errorQuestionInput.innerText = "question must contains '?'";
    return submitBtn.setAttribute("disabled", "");
  }

  if (value.length <= 4) {
    errorQuestionInput.innerText =
      "question must contains at least 4 caracters";
    return submitBtn.setAttribute("disabled", "");
  }
  errorQuestionInput.innerText = "";
  submitBtn.removeAttribute("disabled");
});
const loadQuestions = () => {
  questionsDiv.innerHTML = "";
  const xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.addEventListener("load", () => {
    if (xhr.status != 200) return alert("error" + xhr.response);
    let data = JSON.parse(xhr.response);
    data.forEach((ele) => addQuestionToDiv(ele));
  });
  xhr.addEventListener("error", () => {
    alert("error");
  });
  xhr.send();
};
loadQuestions();
const addQuestionToDiv = (data) => {
  const container = document.createElement("div");
  const span = document.createElement("span");
  const div = document.createElement("div");
  const btnSwitch = document.createElement("button");
  const btnDelete = document.createElement("button");
  container.appendChild(span);
  container.appendChild(div);
  container.appendChild(btnSwitch);
  container.appendChild(btnDelete);
  questionsDiv.appendChild(container);

  container.classList.add("question");
  container.classList.add(data.answer + "");
  span.classList.add("idQuestion");
  span.innerText = document.getElementsByClassName("question").length;
  div.classList.add("content");
  div.innerText = data.question;
  btnDelete.innerText = "Delete";
  btnSwitch.innerText = "Switch";
  btnDelete.classList.add("delete");
  btnSwitch.classList.add("switch");
  countQuestionsSpan.innerText=parseInt(countQuestionsSpan.innerText)+1
  btnDelete.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("delete", url + "/" + data.id, true);
    xhr.addEventListener("load", () => {
      if (xhr.status != 200) return alert("error" + xhr.response);
      container.remove()
      updateNumbers()
      countQuestionsSpan.innerText=parseInt(countQuestionsSpan.innerText)-1
    });
    xhr.addEventListener("error", () => {
      alert("error");
    });
    xhr.send()
  });
  btnSwitch.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("put", url + "/" + data.id, true);
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.addEventListener("load", () => {
      if (xhr.status != 200) return alert("error" + xhr.response);
        container.classList.toggle("true")
        container.classList.toggle("false")
    });
    xhr.addEventListener("error", () => {
      alert("error");
    });
    let dataPutToSend = {
        question:data.question,
        answer:!data.answer
    }
    xhr.send(JSON.stringify(dataPutToSend))
  });
};

const updateNumbers = ()=>{
    let spans = [...document.getElementsByClassName("idQuestion")]
   spans.forEach((ele,index)=>ele.innerText=index+1)
}