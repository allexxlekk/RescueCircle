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
    const registerButton = document.getElementById("register-button");
    registerButton.addEventListener('click', registerUser);
    await getRescuers();

    // Get the modal
    const modal = document.getElementById("inventoryModal");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});

const registerUser = async (event) => {
    event.preventDefault(); // Prevent form submission

    const registerObject = {
        username: document.getElementById("username").value,
        name: document.getElementById("fullname").value,
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
        renderRescuers(rescuers);
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
        listItem.dataset.id = rescuer.id; // Store the rescuer id for later use

        listItem.innerHTML = `
            <div class="rescuer-info">
                <p><strong>Username:</strong> ${rescuer.username}</p>
                <p><strong>Full Name:</strong> ${rescuer.name}</p>
                <p><strong>Email:</strong> ${rescuer.email}</p>
                <p><strong>Phone:</strong> ${rescuer.phone}</p>
                <p><strong>Vehicle Type:</strong> ${rescuer.vehicleType || 'N/A'}</p>
                <p><strong>Status:</strong> ${rescuer.status || 'WAITING'}</p>
                <p><strong>Active Tasks:</strong> ${rescuer.tasks || '0'}</p>
            </div>
        `;
        listItem.addEventListener('click', () => showInventory(rescuer.id));
        rescuerList.appendChild(listItem);
    });
}

async function showInventory(rescuerId) {
    try {
        const response = await fetch(`http://localhost:3000/admin/rescuer-management/rescuers/${rescuerId}/inventory`);
        if (!response.ok) {
            throw new Error("Error fetching inventory");
        }
        const inventory = await response.json();
        renderInventory(inventory);

        // Show the modal
        const modal = document.getElementById("inventoryModal");
        modal.style.display = "block";
    } catch (error) {
        console.error("Error:", error);
        alert("Error fetching inventory. Please try again.");
    }
}
function renderInventory(inventory) {
    const inventoryList = document.getElementById("inventory-list");
    inventoryList.innerHTML = ""; // Clear existing list

    if (inventory.length === 0) {
        const emptyMessage = document.createElement("h3");
        emptyMessage.textContent = "Inventory empty";
        inventoryList.appendChild(emptyMessage);
    } else {
        inventory.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.className = "inventory-item";

            itemElement.innerHTML = `
                <p><strong>Item:</strong> ${item.item}</p>
                <p><strong>Amount:</strong> ${item.amount}</p>
            `;
            inventoryList.appendChild(itemElement);
        });
    }
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
