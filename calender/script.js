document.addEventListener("DOMContentLoaded", function() {
    const monthYearElement = document.getElementById("monthYear");
    const calendarBody = document.getElementById("calendarBody");
    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");
       
 
    let currentPopup = null;

document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll(".date-column, .weekday-column");

    cells.forEach(cell => resizeText(cell));
});

function resizeText(cell) {
    let fontSize = parseFloat(window.getComputedStyle(cell).fontSize);

    while (cell.scrollWidth > cell.clientWidth && fontSize > 10) {  // 最小フォントサイズを10pxに設定
        fontSize -= 1;
        cell.style.fontSize = fontSize + "px";
    }
}


    function showPopup(event, row) {
        if (currentPopup) {
            currentPopup.remove();
        }

        const popup = document.createElement("div");
        popup.classList.add("popup");

        if (row[6]) {
            const xIcon = document.createElement("img");
            xIcon.src = "https://vcalender.blob.core.windows.net/icons/x.png";
            xIcon.classList.add("popup-icon");
            xIcon.addEventListener("click", () => window.open(row[6], "_blank"));
            popup.appendChild(xIcon);
        }

if (row[7]) {
    let youtubeIcon = null;

    if (row[7].startsWith("https://www")) {
        youtubeIcon = document.createElement("img");
        youtubeIcon.src = "https://vcalender.blob.core.windows.net/icons/youtube.png";
    } else if (row[7].startsWith("https://space")) {
        youtubeIcon = document.createElement("img");
        youtubeIcon.src = "https://vcalender.blob.core.windows.net/icons/bilibili.png";
    }

    if (youtubeIcon) {
        youtubeIcon.classList.add("popup-icon");
        youtubeIcon.addEventListener("click", () => window.open(row[7], "_blank"));
        popup.appendChild(youtubeIcon);
    }
}

        popup.style.position = "absolute";
        popup.style.left = `${event.clientX}px`;
        popup.style.top = `${event.clientY - 60}px`;

        document.body.appendChild(popup);
        currentPopup = popup;
    }

    function loadCSVAndUpdateCalendar() {
        fetch("https://vcalender.blob.core.windows.net/testdata/マスタ.csv")
            .then(response => response.text())
            .then(data => {
                const csvData = parseCSV(data);
                updateCalendar(csvData);
            })
            .catch(error => console.error("CSV読み込みエラー:", error));
    }

    function parseCSV(data) {
        const rows = data.split("\n").map(row => row.split(","));
        return rows;
    }

    function updateCalendar(csvData) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYearElement.textContent = `${year}年${month + 1}月`;

        calendarBody.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for (let date = 1; date <= lastDate; date++) {
            const row = document.createElement("tr");

            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
                row.style.backgroundColor = "lightyellow";
            }

            const dateCell = document.createElement("td");
            dateCell.textContent = date;
            row.appendChild(dateCell);

            const day = new Date(year, month, date).getDay();
            const dayCell = document.createElement("td");
            dayCell.textContent = ["日", "月", "火", "水", "木", "金", "土"][day];
            if (day === 0) dayCell.classList.add("sunday");
            if (day === 6) dayCell.classList.add("saturday");
            row.appendChild(dayCell);

            const birthdayCell = document.createElement("td");
            const formattedDate = `${month + 1}/${date}`;
            const birthdayEvents = [];

            csvData.forEach(row => {
                if (row[10] && row[10].trim() !== "") return;

                if (row[0] === formattedDate && row[1]) {
                    let iconImg = "";
                    switch (row[2]) {
                        case "にじさんじ": iconImg = "nijisannji.png"; break;
                        case "ホロライブ": iconImg = "hololive.png"; break;
                        case ".LIVE": iconImg = "dootolive.png"; break;
                        case "Neo-Porte": iconImg = "Neoporte.png"; break;
                        case "あおぎり高校": iconImg = "aogirikoukou.png"; break;
                        case "ぶいすぽっ！": iconImg = "vspo.png"; break;
                        case "のりプロ": iconImg = "noriporo.png"; break;
                        case "ななしいんく": iconImg = "nanasiinku.png"; break;
                    }
                    if (iconImg) {
                        const birthdayEvent = document.createElement("div");
                        birthdayEvent.innerHTML = `<img src="https://vcalender.blob.core.windows.net/icons/${iconImg}" 
                        alt="${row[2]}" style="height:16px; vertical-align:middle;"> ${row[1]}`;
                        birthdayEvent.addEventListener("click", (event) => showPopup(event, row));
                        birthdayEvents.push(birthdayEvent);
                    } else {
                        const birthdayEvent = document.createElement("div");
                        birthdayEvent.textContent = row[1];
                        birthdayEvent.addEventListener("click", (event) => showPopup(event, row));
                        birthdayEvents.push(birthdayEvent);
                    }
                }
            });

            birthdayEvents.forEach(event => birthdayCell.appendChild(event));
            row.appendChild(birthdayCell);

            const commemorationCell = document.createElement("td");
            const commemorationEvents = [];

            csvData.forEach(row => {
                if (row[10] && row[10].trim() !== "") return;

                if (row[5]) {
                    const [eventYear, eventMonth, eventDate] = row[5].split("/").map(Number);
                    if (eventMonth === month + 1 && eventDate === date && row[1]) {
                        const yearsSince = year - eventYear;
                        let iconImg = "";
                        switch (row[2]) {
                            case "にじさんじ": iconImg = "nijisannji.png"; break;
                            case "ホロライブ": iconImg = "hololive.png"; break;
                            case ".LIVE": iconImg = "dootolive.png"; break;
                            case "Neo-Porte": iconImg = "Neoporte.png"; break;
                            case "あおぎり高校": iconImg = "aogirikoukou.png"; break;
                            case "ぶいすぽっ！": iconImg = "vspo.png"; break;
                            case "のりプロ": iconImg = "noriporo.png"; break;
                            case "ななしいんく": iconImg = "nanasiinku.png"; break;
                        }
                        const glitterEvent = `${row[1]} <span class="glitter-text">${yearsSince}周年</span>`;
                        if (iconImg) {
                            const commemorationEvent = document.createElement("div");
                            commemorationEvent.innerHTML = `<img src="https://vcalender.blob.core.windows.net/icons/${iconImg}" 
                            alt="${row[2]}" style="height:16px; vertical-align:middle;"> ${glitterEvent}`;
                            commemorationEvent.addEventListener("click", (event) => showPopup(event, row));
                            commemorationEvents.push(commemorationEvent);
                        } else {
                            const commemorationEvent = document.createElement("div");
                            commemorationEvent.innerHTML = glitterEvent;
                            commemorationEvent.addEventListener("click", (event) => showPopup(event, row));
                            commemorationEvents.push(commemorationEvent);
                        }
                    }
                }
            });

            commemorationEvents.forEach(event => commemorationCell.appendChild(event));
            row.appendChild(commemorationCell);

            calendarBody.appendChild(row);
        }
    }

    prevMonthButton.addEventListener("click", () => {
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }
        currentDate.setMonth(currentDate.getMonth() - 1);
        loadCSVAndUpdateCalendar();
    });

    nextMonthButton.addEventListener("click", () => {
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }
        currentDate.setMonth(currentDate.getMonth() + 1);
        loadCSVAndUpdateCalendar();
    });

    const currentDate = new Date();
    loadCSVAndUpdateCalendar();
});
