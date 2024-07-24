document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', loginUser);

    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener('click', loginUser);

});

//API CALLS

async function postLogin(loginObject) {
    const postLogin = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginObject),
    });
    let jwt = await postLogin.json();
    console.log(jwt);

}

const loginUser = async (event) => {
    event.preventDefault();
    const loginObject = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    try {
        await postLogin(loginObject);
        alert("Login successful");
        //TODO go to page based on role
        window.location.href = './citizenPage.html';
    } catch (error) {

        console.error("Login failed", error);
        alert("login failed. Please try again.");
    }
};

