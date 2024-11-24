document.addEventListener("DOMContentLoaded", function () {
    const monthYearElement = document.getElementById("monthYear");
    const calendarBody = document.getElementById("calendarBody");
    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");

    let currentPopup = null;

    // 案内文を設定
    calendarGuide.innerHTML = ` 名前をタップすると<span style="color: blue; text-decoration: underline;">YouTube</span> や <span style="color: green; text-decoration: underline;">X (旧Twitter)</span> に移動できます。`;

    // 全体のクリックイベントリスナー
    document.addEventListener("click", function (event) {
        if (currentPopup && !currentPopup.contains(event.target)) {
            currentPopup.remove();
            currentPopup = null;
        }
    });

    function showPopup(event, row) {
        if (currentPopup) {
            currentPopup.remove();
        }

        const popup = document.createElement("div");
        popup.classList.add("popup");

        // クリックしたイベント名を虹色で表示
        const popupTitle = document.createElement("div");
        popupTitle.classList.add("popup-title");
        popupTitle.textContent = row[1];
        popup.appendChild(popupTitle);

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

        event.stopPropagation();
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
        const rows = data.split("\n").map(row => row.split(",").map(cell => cell.trim()));
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
            const birthdayEvents = [];

            const formattedDate = `${month + 1}/${date}`;

            csvData.forEach(row => {
                if (!row[0] || !row[1]) return;

                // 誕生日処理
                if (row[0] === formattedDate) {
                    const iconImg = getIconForGroup(row[2]);
                    const birthdayEvent = createEventElement(row[1], iconImg, row);
                    birthdayEvents.push(birthdayEvent);
                }
            });

            birthdayEvents.forEach(event => birthdayCell.appendChild(event));
            row.appendChild(birthdayCell);

            calendarBody.appendChild(row);
        }
    }

    function getIconForGroup(group) {
        const icons = {
            "にじさんじ": "nijisannji.png",
            "ホロライブ": "hololive.png",
            ".LIVE": "dootolive.png",
            "Neo-Porte": "Neoporte.png",
            "あおぎり高校": "aogirikoukou.png",
            "ぶいすぽっ！": "vspo.png",
            "のりプロ": "noriporo.png",
            "ななしいんく": "nanasiinku.png",
            "ホロスターズ": "holostars.jpg", 
            "VirtuaReal": "VirtuaReal.png" 
        };
        return icons[group] || "";
    }

    function createEventElement(content, iconImg, row) {
        const eventElement = document.createElement("div");
        if (iconImg) {
            eventElement.innerHTML = `<img src="https://vcalender.blob.core.windows.net/icons/${iconImg}" 
            alt="${row[2]}" style="height:16px; vertical-align:middle;"> ${content}`;
        } else {
            eventElement.textContent = content;
        }
        eventElement.addEventListener("click", (event) => showPopup(event, row));
        return eventElement;
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
