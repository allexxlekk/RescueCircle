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

        const taskClass = rescuer.tasks > 0 ? 'rescuer-tasks-active' : 'rescuer-tasks-zero';
        const vehicleClass = getVehicleClass(rescuer.vehicleType);

        listItem.innerHTML = `
            <div class="rescuer-info">
                <p class="rescuer-info-row"><strong>Username:</strong> <span class="rescuer-username">${rescuer.username}</span></p>
                <p class="rescuer-info-row"><strong>Full Name:</strong><span class="rescuer-name"> ${rescuer.name}</span></p>
                <p class="rescuer-info-row"><strong>Vehicle Type:</strong> <span class="rescuer-vehicle-type ${vehicleClass}">${rescuer.vehicleType || 'N/A'}</span></p>
                <p class="rescuer-info-row"><strong>Status:</strong><span class="rescuer-status"> ${rescuer.status || 'WAITING'}</span></p>
                <p class="rescuer-info-row"><strong>Active Tasks:</strong><span class="rescuer-tasks ${taskClass}"> ${rescuer.tasks || '0'}</span></p>
                <div class="rescuer-contact">
                    <p class="rescuer-info-contact"><strong>✉:</strong> <span class="rescuer-email">${rescuer.email}</span></p>
                    <p class="rescuer-info-contact"><strong>🕻:</strong> <span class="rescuer-phone"> ${rescuer.phone}</span></p> 
                </div>
            </div>
        `;
        listItem.addEventListener('click', () => showInventory(rescuer.id));
        rescuerList.appendChild(listItem);
    });
}
// for display reasons 
function getVehicleClass(vehicleType) {
    switch (vehicleType) {
        case 'VAN':
            return 'vehicle-van';
        case 'PERSONAL USE':
            return 'vehicle-personal';
        case 'PICKUP TRUCK':
            return 'vehicle-pickup';
        default:
            return '';
    }
}

async function showInventory(rescuerId) {
    try {
        // Fetch the list of rescuers
        const rescuersResponse = await fetch("http://localhost:3000/admin/rescuer-management/rescuers");
        if (!rescuersResponse.ok) {
            throw new Error("Error fetching rescuers");
        }
        const rescuers = await rescuersResponse.json();

        // Find the rescuer's name
        const rescuer = rescuers.find(rescuer => rescuer.id === rescuerId);
        const rescuerName = rescuer ? rescuer.name : 'Unknown Rescuer';

        // Fetch the inventory for the specific rescuer
        const inventoryResponse = await fetch(`http://localhost:3000/admin/rescuer-management/rescuers/${rescuerId}/inventory`);
        if (!inventoryResponse.ok) {
            throw new Error("Error fetching inventory");
        }
        const inventory = await inventoryResponse.json();
        renderInventory(inventory);

        // Show the rescuer's name in the modal
        document.getElementById("rescuerName").textContent = `Inventory for ${rescuerName}`;

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
                  <p class="inventory-info-row"><strong>Item:</strong> <span class="inventory-item-name">${item.item}</span></p>
                  <p class="inventory-info-row"><strong>Category:</strong> <span class="inventory-item-category">${item.category}</span></p>

                <p class="inventory-info-row"><strong>Amount:</strong> <span class="inventory-item-amount">${item.amount}</span></p>
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
