async function postRegister(register) {
    const postRegister = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
    });
}

//
document.addEventListener("DOMContentLoaded", async () => {


    const registerButton = document.getElementById("register-button");
    registerButton.addEventListener('click', registerUser);

});

const registerUser = async () => {

    const registerObject = {
        username: document.getElementById("username").value,
        fullname: document.getElementById("fullname").value,
        role: 'RESCUER',
        latitude: '0',
        longitude: '0',
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value,
        vehicleType: document.getElementById("vehicle_type").value,
    };
    console.log(registerObject);
    await postRegister(registerObject);
};

async function getBaseLocation() {
    try {
        const response = await fetch("http://localhost:3000/baseLocation");

        return await response.json(); // Return the data
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}
