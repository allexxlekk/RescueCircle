document.addEventListener('DOMContentLoaded', () => {

    const usernameInput = document.getElementById('username');
    const usernameAvailabilityResult = document.getElementById('usernameAvailabilityResult');

    // Function to check username availability
    const checkUsernameAvailability = async () => {
        const username = usernameInput.value;

        if (username === '')
            usernameAvailabilityResult.textContent = '';
        else
            // Send a GET request to the server to check username availability
            try {
                const response = await fetch('http://localhost:3000/users/checkusername?str=' + encodeURIComponent(username));
                const isAvailable = await response.json();

                console.log(isAvailable)
                if (isAvailable) {
                    usernameAvailabilityResult.textContent = 'Username is available.';
                } else {
                    usernameAvailabilityResult.textContent = 'Username is already taken.';
                }
            } catch (error) {
                console.error('Error checking username availability:', error);
                usernameAvailabilityResult.textContent = 'Error checking username availability.';
            }
    };

    // Define a debounce function with a 300ms delay
    const debounceCheckUsernameAvailability = debounce(checkUsernameAvailability, 300);

    // Add a click event listener to the "Check Username Availability" button
    usernameInput.addEventListener('input', debounceCheckUsernameAvailability)
});

// Set a timer before 
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}