async function postRegister(register) {
    const response = await fetch("http://localhost:3000/admin/rescuer-management/rescuers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
    });

    if (!response.ok) {
        throw new Error("Error registering rescuer");
    }

    return await response.json();
}

document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("register-button");
    registerButton.addEventListener('click', registerUser);
});

const registerUser = async (event) => {
    event.preventDefault(); // Prevent form submission

    const registerObject = {
        username: document.getElementById("username").value,
        name: document.getElementById("fullname").value,
        // role: 'RESCUER',
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value,
        vehicleType: document.getElementById("vehicle_type").value,
    };

    try {
        console.log(registerObject);
        const response = await postRegister(registerObject);
        alert("Registration Confirmed!");
        console.log("Response from server:", response);
    } catch (error) {
        console.error("Error:", error);
        alert("Error registering rescuer. Please try again.");
    }
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
