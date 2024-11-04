document.addEventListener("DOMContentLoaded", function() {
    const monthYearElement = document.getElementById("monthYear");
    const calendarBody = document.getElementById("calendarBody");
    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");

    let currentDate = new Date();
    loadCSVAndUpdateCalendar();

    prevMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        loadCSVAndUpdateCalendar();
    });

    nextMonthButton.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        loadCSVAndUpdateCalendar();
    });

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

            // 日付
            const dateCell = document.createElement("td");
            dateCell.textContent = date;
            row.appendChild(dateCell);

            // 曜日
            const day = new Date(year, month, date).getDay();
            const dayCell = document.createElement("td");
            dayCell.textContent = ["日", "月", "火", "水", "木", "金", "土"][day];
            if (day === 0) dayCell.classList.add("sunday");
            if (day === 6) dayCell.classList.add("saturday");
            row.appendChild(dayCell);

            // 誕生日
            const birthdayCell = document.createElement("td");
            const formattedDate = `${month + 1}/${date}`;
            const birthdayEvents = [];

            csvData.forEach(row => {
                // 10列目が空欄でない場合はスキップ
                if (row[10] && row[10].trim() !== "") return;
                
                // 誕生日イベントの表示
                 if (row[0] === formattedDate && row[1] && row[10] !== "1") { // 10列目が"1"でない場合
                    let iconImg = "";
                    switch (row[2]) { // 2列目の値に基づき画像ファイルを指定
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
                        birthdayEvents.push(
                            `<img src="https://vcalender.blob.core.windows.net/icons/${iconImg}" 
                            alt="${row[2]}" style="height:16px; vertical-align:middle;"> ${row[1]}`
                        );
                    } else {
                        birthdayEvents.push(row[1]);
                    }
                }
            });

            if (birthdayEvents.length > 0) {
                birthdayCell.innerHTML = birthdayEvents.join("<br>");
            }
            row.appendChild(birthdayCell);

            // 記念日
            const commemorationCell = document.createElement("td");
            const commemorationEvents = [];

            csvData.forEach(row => {
                // 10列目が空欄でない場合はスキップ
                if (row[10] && row[10].trim() !== "") return;

                // 記念日イベントの表示
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
                            commemorationEvents.push(
                                `<img src="https://vcalender.blob.core.windows.net/icons/${iconImg}" 
                                alt="${row[2]}" style="height:16px; vertical-align:middle;"> ${glitterEvent}`
                            );
                        } else {
                            commemorationEvents.push(glitterEvent);
                        }
                    }
                }
            });

            if (commemorationEvents.length > 0) {
                commemorationCell.innerHTML = commemorationEvents.join("<br>");
            }
            row.appendChild(commemorationCell);

            calendarBody.appendChild(row);
        }
    }
});
