const data = Object.fromEntries(new URLSearchParams(window.location.search).entries());
const localStorageData = JSON.parse(localStorage.getItem('formData') || '{}');

const confirmElement = document.querySelector(".confirm");
const timeElement = document.getElementById("time");
const updateText = document.querySelector(".bottom_update_value");
const updateButton = document.querySelector(".update");
const unfoldElement = document.querySelector(".info_holder");

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setClock();
    
    if (!localStorage.getItem("update")) {
        localStorage.setItem("update", new Date().toLocaleDateString("pl-PL"));
    }
    updateText.textContent = localStorage.getItem("update");

    if (!localStorage.getItem("homeDate")) {
        const randomDate = new Date();
        randomDate.setDate(Math.floor(Math.random() * 25) + 1);
        randomDate.setMonth(Math.floor(Math.random() * 12));
        randomDate.setFullYear(Math.floor(Math.random() * 8) + 2012);
        localStorage.setItem("homeDate", randomDate.toLocaleDateString("pl-PL"));
    }
    document.querySelector(".home_date").textContent = localStorage.getItem("homeDate");

    updateButton.addEventListener('click', () => {
        const newDate = new Date().toLocaleDateString("pl-PL");
        localStorage.setItem("update", newDate);
        updateText.textContent = newDate;
        window.scrollTo(0, 0);
    });

    unfoldElement.addEventListener('click', () => {
        unfoldElement.classList.toggle("unfolded");
    });
});

function initializeData() {
    const savedImage = localStorage.getItem('uploadedImage');
    if (savedImage) {
        document.querySelector('.id_own_image').style.backgroundImage = `url(${savedImage})`;
        data['image'] = savedImage;
    }

    const birthday = data['birthday'] ? data['birthday'].split(".") : [];
    const birthdayDate = new Date();
    
    if (birthday.length === 3) {
        birthdayDate.setDate(parseInt(birthday[0]) || 1);
        birthdayDate.setMonth((parseInt(birthday[1]) || 1) - 1);
        birthdayDate.setFullYear(parseInt(birthday[2]) || 2000);
    }

    const fields = {
        name: data['name']?.toUpperCase() || localStorageData.name?.toUpperCase() || '',
        surname: data['surname']?.toUpperCase() || localStorageData.surname?.toUpperCase() || '',
        nationality: data['nationality']?.toUpperCase() || localStorageData.nationality?.toUpperCase() || '',
        birthday: birthdayDate.toLocaleDateString("pl-PL"),
        familyName: data['familyName'] || localStorageData.familyName || '',
        sex: data['sex'] === "m" ? "Mężczyzna" : "Kobieta",
        fathersFamilyName: data['fathersFamilyName'] || localStorageData.fathersFamilyName || '',
        mothersFamilyName: data['mothersFamilyName'] || localStorageData.mothersFamilyName || '',
        birthPlace: data['birthPlace'] || localStorageData.birthPlace || '',
        countryOfBirth: data['countryOfBirth'] || localStorageData.countryOfBirth || '',
        adress: data['adress1'] ? `ul. ${data['adress1']}<br>${data['adress2']} ${data['city']}` : ''
    };

    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = value;
    });

    if (birthday.length === 3) {
        generatePESEL(birthday, fields.sex);
    }
}

function generatePESEL(birthday, sex) {
    let [day, month, year] = birthday.map(Number);
    if (year >= 2000) month += 20;
    const sexNum = sex === "Mężczyzna" ? "0295" : "0382";
    
    day = day.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    
    const pesel = year.toString().substring(2) + month + day + sexNum + "7";
    document.getElementById("pesel").innerHTML = pesel;
}

function setClock() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'numeric', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    timeElement.textContent = `Czas: ${now.toLocaleTimeString("pl-PL", timeOptions)} ${now.toLocaleDateString("pl-PL", dateOptions)}`;
    setTimeout(setClock, 1000);
}

function closePage() {
    confirmElement.classList.remove("page_open", "page_1_open", "page_2_open", "page_3_open");
}

function openPage(page) {
    closePage();
    confirmElement.classList.add("page_open", `page_${page}_open`);
}
