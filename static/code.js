document.getElementById('date').value = new Date().toISOString().substring(0, 10);

const updateValue = (id, valueId) => {
    const value = document.querySelector(`#${id}`).value;
    let text = '3 - okay';
    if (value === '1') {
        text = '1 - very poor';
    } else if (value === '2') {
        text = '2 - poor';
    } else if (value === '4') {
        text = '4 - good';
    } else if (value === '5') {
        text = '5 - very good';
    }
    document.querySelector(`#${valueId}`).innerHTML = text;
}