let form = document.querySelector("form");
let bookName = document.querySelector("#bookName");
let startPage = document.querySelector("#startPage");
let endPage = document.querySelector("#endPage");
let books = document.querySelector(".todos");
let btn = document.querySelector("#submitButton");
let total = document.querySelector("#totalProgress");
let totalProgressBar = document.querySelector("#totalProgressBar");
var bookList = JSON.parse(localStorage.getItem("books")) || [];

function addBook(name, start, end, currP = start) {
  // Creating New Elements
  let book = document.createElement("div");
  let textEl = document.createElement("span");
  let currPage = document.createElement("div");
  let currPageInput = document.createElement("input");
  let inputButton = document.createElement("input");

  currPageInput.type = "number";
  currPageInput.class = "input-button";
  currPageInput.placeholder = "Insert current page";

  inputButton.type = "button";
  inputButton.value = "OK";

  // Setting values & Styles
  textEl.innerHTML = `Book name: ${name} <br>Start page: ${start} <br>End page: ${end}`;
  textEl.setAttribute("startPage", start);
  textEl.setAttribute("endPage", end);
  textEl.setAttribute("currentPage", currP);
  textEl.setAttribute(
    "progress",
    (((currP - start) / (end - start)) * 100).toFixed(2)
  );
  textEl.classList.add("book");
  currPage.innerHTML = `Current page: ${currP} <br>Progress: ${textEl.getAttribute(
    "progress"
  )}%`;

  // Appending Our Element To The DOM

  textEl.append(currPage);
  textEl.append(currPageInput);
  textEl.append(inputButton);
  book.appendChild(textEl);

  let closeEl = document.createElement("span");
  closeEl.innerHTML = "&times;";
  closeEl.classList.add("delete");

  let progressBar = document.createElement("progress");
  progressBar.setAttribute("value", Number(textEl.getAttribute("progress")));
  progressBar.setAttribute("max", 100);

  // Attaching Events
  inputButton.addEventListener("click", function (e) {
    let value = currPageInput.value;
    if (!value.trim()) return;
    value = Number(value);
    if (Number(value) < start || Number(value) > end) return;
    let oldValue = Number(textEl.getAttribute("currentpage"));
    let diff = value - oldValue;
    bookList.forEach(function (book) {
      if (book.name === name) {
        book.current = value;
        return;
      }
    });
    localStorage.setItem("books", JSON.stringify(bookList));

    textEl.setAttribute(
      "progress",
      (((value - start) / (end - start)) * 100).toFixed(2)
    );

    currPage.innerHTML = `Current page: ${value} <br>Progress: ${textEl.getAttribute(
      "progress"
    )}%`;
    textEl.setAttribute("currentpage", value);
    currPageInput.value = "";

    let readP = Number(total.getAttribute("readpages"));
    let totalP = Number(total.getAttribute("totalpages"));
    readP = readP + diff;
    total.setAttribute("readpages", readP);
    total.setAttribute("progress", `${((readP / totalP) * 100).toFixed(2)}`);
    total.innerHTML = `Total pages read: ${readP}<br />Total pages: ${totalP} <br />Progress: ${total.getAttribute(
      "progress"
    )}%`;
    totalProgressBar.setAttribute("value", total.getAttribute("progress"));

    progressBar.setAttribute("value", Number(textEl.getAttribute("progress")));
  });

  closeEl.addEventListener("click", function (e) {
    let readP = Number(total.getAttribute("readpages"));
    let totalP = Number(total.getAttribute("totalpages"));
    readP = readP - (Number(textEl.getAttribute("currentpage")) - start);
    total.setAttribute("readpages", readP);
    totalP = totalP - (end - start);
    total.setAttribute("totalpages", totalP);
    total.setAttribute("progress", `${((readP / totalP) * 100).toFixed(2)}`);
    total.innerHTML = `Total pages read: ${readP}<br />Total pages: ${totalP} <br />Progress: ${total.getAttribute(
      "progress"
    )}%`;
    bookList = bookList.filter(function (book) {
      return book.name != name;
    });
    console.log(bookList);
    localStorage.setItem("books", JSON.stringify(bookList));
    totalProgressBar.setAttribute("value", total.getAttribute("progress"));
    books.removeChild(book);
  });

  book.appendChild(progressBar);

  book.appendChild(closeEl);

  book.classList.add("todo");
  return book;
}

function displayBooks() {
  // Display each book in the list
  bookList.forEach(function (book) {
    let name = book.name;
    let start = Number(book.start);
    let end = Number(book.end);
    let curr = Number(book.current);
    books.appendChild(addBook(name, start, end, curr));
    let readP = Number(total.getAttribute("readpages"));
    readP = readP + (curr - start);
    let totalP = Number(total.getAttribute("totalpages"));
    totalP = totalP + (end - start);

    total.setAttribute("readpages", readP);
    total.setAttribute("totalpages", totalP);
    total.setAttribute("progress", `${((readP / totalP) * 100).toFixed(2)}`);
    total.innerHTML = `Total pages read: ${readP}<br />Total pages: ${totalP} <br />Progress: ${total.getAttribute(
      "progress"
    )}%`;

    totalProgressBar.setAttribute("value", total.getAttribute("progress"));
  });
}

btn.addEventListener("click", (e) => {
  // preventing the default behavior
  e.preventDefault();
  let name = bookName.value;
  let start = startPage.value;
  let end = endPage.value;
  if (!name.trim() || !start.trim() || !end.trim()) return;
  start = Number(start);
  end = Number(end);
  books.appendChild(addBook(name, start, end));
  let readP = Number(total.getAttribute("readpages"));
  let totalP = Number(total.getAttribute("totalpages"));
  totalP = totalP + (end - start);

  total.setAttribute("totalpages", totalP);
  total.setAttribute("progress", `${((readP / totalP) * 100).toFixed(2)}%`);
  total.innerHTML = `Total pages read: ${readP}<br />Total pages: ${totalP} <br />Progress: ${total.getAttribute(
    "progress"
  )}`;
  bookList.push({ name: name, start: start, end: end, current: start });
  localStorage.setItem("books", JSON.stringify(bookList));

  bookName.value = "";
  startPage.value = "";
  endPage.value = "";
});

displayBooks();
