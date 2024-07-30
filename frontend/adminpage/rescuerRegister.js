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

document.addEventListener("DOMContentLoaded", async () => {
    renderRescuers(await getRescuers());
    const registerButton = document.getElementById("register-button");
    registerButton.addEventListener('click', registerUser);

});

const registerUser = async (event) => {
    event.preventDefault(); // Prevent form submission

    const registerObject = {
        username: document.getElementById("username").value,
        name: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value,
        vehicleType: document.getElementById("vehicle_type").value, // Fixed the ID here
    };

    try {
        console.log(registerObject);
        const response = await postRegister(registerObject);
        alert("Registration Confirmed!");
        console.log("Response from server:", response);
        await getRescuers(); // Refresh the list after registration
    } catch (error) {
        console.error("Error:", error);
        alert("Error registering rescuer. Please try again.");
    }
};

async function getRescuers() {
    try {
        const response = await fetch("http://localhost:3000/admin/rescuer-management/rescuers");
        if (!response.ok) {
            throw new Error("Error fetching rescuers");
        }
        const rescuers = await response.json();
        return rescuers;
    } catch (error) {
        console.error("Error:", error);
        alert("Error fetching rescuers. Please try again.");
    }
}

function renderRescuers(rescuers) {
    const rescuerList = document.getElementById("rescuer-list");
    rescuerList.innerHTML = ""; // Clear existing list

    rescuers.forEach((rescuer) => {
        const listItem = document.createElement("li");
        listItem.className = "rescuer-item";

        listItem.innerHTML = `
            <div class="rescuer-info">
                <p><strong>Username:</strong> ${rescuer.username}</p>
                <p><strong>Full Name:</strong> ${rescuer.name}</p>
                <p><strong>Email:</strong> ${rescuer.email}</p>
                <p><strong>Phone:</strong> ${rescuer.phone}</p>
                <p><strong>Vehicle Type:</strong> ${rescuer.vehicleType}</p>
                <p><strong>Status:</strong> ${rescuer.status || 'N/A'}</p>
                <p><strong>Active Tasks:</strong> ${rescuer.tasks || '0'}</p>
            </div>
        `;
        rescuerList.appendChild(listItem);
    });
}

async function getBaseLocation() {
    try {
        const response = await fetch("http://localhost:3000/baseLocation");
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}
