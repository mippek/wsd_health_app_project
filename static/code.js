const setDate = () => {
    document.getElementById('date').value = new Date().toISOString().substring(0, 10);
}

const updateValue = (id, valueId) => {
    const value = document.querySelector(`#${id}`).value;
    let text = 'Your choice: 3 - okay';
    if (value === '1') {
        text = 'Your choice: 1 - very poor';
    } else if (value === '2') {
        text = 'Your choice: 2 - poor';
    } else if (value === '4') {
        text = 'Your choice: 4 - good';
    } else if (value === '5') {
        text = 'Your choice: 5 - very good';
    }
    document.querySelector(`#${valueId}`).innerHTML = text;
}

const selectWeekForm = () => {
    const defaultWeek = document.querySelector('.defaultWeek');
    const backupWeek = document.querySelector('.backupWeek');
    const weeks = document.querySelector('#week');

    if (defaultWeek && backupWeek) {
        backupWeek.style.display = 'none';

        const test = document.createElement('input');
        try {
            test.type = 'week';
        } catch (e) {
            console.log(e);
        }

        if (test.type === 'text') {
            defaultWeek.style.display = 'none';
            backupWeek.style.display = 'block';
            for(let i = 1; i <= 52; i++) {
                const option = document.createElement('option');
                option.textContent = (i < 10) ? ("0" + i) : i;
                option.value = i;
                weeks.appendChild(option);
            }
        }
    }
}

const selectMonthForm = () => {
    const defaultMonth = document.querySelector('.defaultMonth');
    const backupMonth = document.querySelector('.backupMonth');
    const months = document.querySelector('#month');

    if (defaultMonth && backupMonth) {
        backupMonth.style.display = 'none';

        const test = document.createElement('input');
        try {
            test.type = 'month';
        } catch (e) {
            console.log(e);
        }

        if (test.type === 'text') {
            defaultMonth.style.display = 'none';
            backupMonth.style.display = 'block';
            for(let i = 1; i <= 13; i++) {
                const option = document.createElement('option');
                option.textContent = (i < 10) ? ("0" + i) : i;
                option.value = i;
                months.appendChild(option);
            }
        }
    }
}

window.onload = () => {
    selectWeekForm();
    selectMonthForm();
}


