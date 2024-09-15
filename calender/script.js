document.addEventListener('DOMContentLoaded', function () {
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const monthYear = document.getElementById('month-year');
    const calendarBody = document.getElementById('calendar-body');

    document.getElementById('prev-month').addEventListener('click', function () {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        showCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-month').addEventListener('click', function () {
        currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
        showCalendar(currentMonth, currentYear);
    });

    // CSVデータを取得してイベントを反映する関数
    function loadCSVAndUpdateCalendar(year, month) {
        const sasUrl = 'https://vcalender.blob.core.windows.net/data/%E3%83%9E%E3%82%B9%E3%82%BF1.csv?sp=r&st=2024-09-15T12:18:59Z&se=2024-09-15T20:18:59Z&spr=https&sv=2022-11-02&sr=b&sig=Fo3bBtnNWJBmxt1WaMvdz167ZP%2F%2FyppcHJlWQDUFP0w%3D';  // ここに取得したSAS URLを入れる

fetch(sasUrl)
            .then(response => response.text())
            .then(data => {
                let rows = data.split('\n');
                let events = {};

                rows.forEach(row => {
                    let columns = row.split(',');

                    // CSVの日付が "9月15日" のようなフォーマットの場合
                    let dateParts = columns[0].replace('月', '-').replace('日', '').split('-');
                    let eventMonth = parseInt(dateParts[0], 10) - 1; // JavaScriptの月は0から始まるので-1
                    let eventDay = parseInt(dateParts[1], 10);
                    
                    // 年はカレンダーの表示される年 (currentYear) を使って補完
                    let eventDate = new Date(currentYear, eventMonth, eventDay);
                    let eventDetails = columns[1];

                    // イベントがカレンダーの表示する月と一致するかチェック
                    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
                        events[eventDate.getDate()] = eventDetails;
                    }
                });

                showCalendar(month, year, events); // イベントをカレンダーに反映
            })
            .catch(error => console.error('Error:', error));
    }


    function showCalendar(month, year, events = {}) {
        const firstDay = (new Date(year, month)).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        calendarBody.innerHTML = "";

        monthYear.innerHTML = `${year}年 ${monthNames[month]}`;

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                let cell = document.createElement('td');
                let dateDiv = document.createElement('div');
                dateDiv.className = 'date'; 
                let cellText = document.createTextNode("");
                
                if (i === 0 && j < firstDay) {
                    cell.appendChild(dateDiv);
                } else if (date > daysInMonth) {
                    break;
                } else {
                    cellText = document.createTextNode(date);
                    dateDiv.appendChild(cellText); 
                    cell.appendChild(dateDiv); 
                    
                    // イベントがある場合、表示する
                    if (events[date]) {
                        let eventDiv = document.createElement('div');
                        eventDiv.className = 'event';
                        eventDiv.textContent = events[date]; // イベント内容を表示
                        cell.appendChild(eventDiv);
                    }

                    // 日曜日と土曜日のクラスを設定
                    if (j === 0) {
                        cell.classList.add("sunday");
                    } else if (j === 6) {
                        cell.classList.add("saturday");
                    }

                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cell.classList.add("highlight");
                    }

                    date++;
                }
                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    // 初期表示時にCSVを読み込んでカレンダーに反映
    loadCSVAndUpdateCalendar(currentYear, currentMonth);

});
