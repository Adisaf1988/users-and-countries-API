const API_USERS = `https://randomuser.me/api/?results=20`;
const API_COUNTRIES = `https://restcountries.com/v3.1/all`;

let countriesData = [];

async function init() {
    try {
        countriesData = await getCountriesApi();
        await getUsersApi();
    } catch (error) {
        console.error("Error initializing data:", error);
    }
}

async function getUsersApi() {
    try {
        const result = await fetch(API_USERS, {
            method: "GET",
        });
        if (!result.ok) throw new Error("Failed to fetch users");

        const data = await result.json();
        draw(data.results);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function draw(usersData) {
    const userCard = document.getElementById("user-card");
    userCard.innerHTML = "";
    const uiUsers = usersData.map(user => getUserUI(user));
    userCard.append(...uiUsers);
}

function getUserUI(user) {
    const userImg = document.createElement("img");
    userImg.classList.add("userImg");
    userImg.src = user?.picture?.large;

    const userFirstName = document.createElement("h2");
    userFirstName.innerText = user?.name?.first;

    const userLastName = document.createElement("h2");
    userLastName.innerText = user?.name?.last;

    const userEmail = document.createElement("h2");
    userEmail.innerText = user?.email;

    const userCountry = document.createElement("button");
    userCountry.classList.add("user-btn")
    userCountry.innerText = user?.location?.country;

    const userFlag = document.createElement("img");
    userFlag.classList.add("countryFlag");
    userFlag.style.display = "none";
    userCountry.addEventListener("click", () => {
        try {
            const country = countriesData.find(c => c.name.common === user.location.country);
            if (country) {
                userFlag.src = country.flags.svg;
                userFlag.style.display = "block";
            } else {
                throw new Error(`Country ${user.location.country} not found`);
            }
        } catch (error) {
            console.error("Error finding country:", error);
        }
    });

    const oneUser = document.createElement("div");
    oneUser.classList.add("user");
    oneUser.append(userImg, userFirstName, userLastName, userEmail, userCountry, userFlag);

    return oneUser;
}

async function getCountriesApi() {
    try {
        const result = await fetch(API_COUNTRIES, {
            method: "GET",
        });
        if (!result.ok) throw new Error("Failed to fetch countries");

        const data = await result.json();
        return data;
    } catch (error) {
        console.error("Error fetching countries:", error);
        throw error; // Re-throw the error to be caught in init
    }
}

init();
