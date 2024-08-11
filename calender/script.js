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

function showCalendar(month, year) {
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
            dateDiv.className = 'date'; // 'date' クラスを設定
            let cellText = document.createTextNode("");
            
            if (i === 0 && j < firstDay) {
                cell.appendChild(dateDiv);
            } else if (date > daysInMonth) {
                break;
            } else {
                cellText = document.createTextNode(date);
                dateDiv.appendChild(cellText); // 日付を div に追加
                cell.appendChild(dateDiv); // div を td に追加
                date++;
                
                // 日曜日と土曜日のクラスを設定
                if (j === 0) {
                    cell.classList.add("sunday");
                } else if (j === 6) {
                    cell.classList.add("saturday");
                }

                if (date - 1 === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("highlight");
                }
            }
            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
}

    showCalendar(currentMonth, currentYear);
});
