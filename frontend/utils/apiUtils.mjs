const apiUtils = {
    // ITEMS
    async fetchItems() {
        try {
            const response = await fetch("http://localhost:3000/items");

            return await response.json(); // Return the data
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    async editItem(item) {
        try {
            await fetch("http://localhost:3000/items", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });
        } catch (error) {
            console.error("Sync error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    async fetchItemById(itemId) {
        try {
            const response = await fetch(`http://localhost:3000/items/${itemId}`);
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    },
    async fetchItemsBySearch(name) {
        try {
            let response;
            if (name === "" || name === undefined || name === null) {
                response = await apiUtils.fetchItems();
                return response;
            } else {
                response = await fetch(
                    `http://localhost:3000/items/search?str=${name}`
                );
                return await response.json(); // Return the data
            }
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    async fetchItemsByCategoryId(categoryId) {
        try {
            const response = await fetch(
                `http://localhost:3000/items/byCategory?id=${categoryId}`
            );

            return await response.json(); // Return the data
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    async fetchItemsByCategoryIdAndSearch(categoryId, searchString) {
        try {
            let response;
            console.log("SearchString:", searchString);
            if (searchString === "" || searchString === undefined || searchString === null) {
                response = await apiUtils.fetchItemsByCategoryId(categoryId);
                return response;
            } else {
                response = await fetch(
                    `http://localhost:3000/items/search?str=${searchString}&categoryId=${categoryId}`
                );
                return await response.json(); // Return the data
            }
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    async fetchItemAvailability(itemName) {
        if (itemName === "") {
            return false;
        } else
            try {
                const response = await fetch(
                    "http://localhost:3000/items/isAvailable?itemName=" +
                    encodeURIComponent(itemName)
                );
                const addedItem = await response.json();
                return addedItem.isAvailable;
            } catch (error) {
                console.error("Error while adding Item:", error);
                return false;
            }
    },
    async syncItems() {
        try {
            await fetch("http://localhost:3000/items/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(undefined),
            });
        } catch (error) {
            console.error("Sync error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    // CATEGORIES
    async fetchCategories() {
        const response = await fetch("http://localhost:3000/categories");
        const data = await response.json();
        return data.categories;
    },
    async getBaseLocation() {
        try {
            const response = await fetch("http://localhost:3000/baseLocation");

            return await response.json(); // Return the data
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    async usernameAvailable(username) {
        try {
            if (username === "" || username === undefined || username === null) {
                return false;
            }
            const response = await fetch("http://localhost:3000/users/checkusername?str=" + username);

            return await response.json(); // Return the data
        } catch
            (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    },
    async emailAvailable(email) {
        try {
            if (email === "" || email === undefined || email === null) {
                return false;
            }
            const response = await fetch("http://localhost:3000/users/checkemail?str=" + email);

            return await response.json(); // Return the data
        } catch
            (error) {
            console.error("Fetch error:", error);
            throw error; // Re-throw the error to be caught in the higher level
        }
    }
    , async register(register) {
        await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(register),
        });
    },
    async postRequest(newRequest) {
        await fetch('http://localhost:3000/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRequest),
        });
    },
    async fetchCitizensRequests(citizenId) {
        let response = null;
        if (citizenId) {
            response = await fetch("http://localhost:3000/requests/citizen/" + citizenId);

        } else {
            response = await fetch("http://localhost:3000/requests/citizen");
        }

        return await response.json(); // Return the data
    },
    async fetchCitizensOffers(citizenId) {
        let response;
        if (citizenId) {
            response = await fetch("http://localhost:3000/offers/citizen/" + citizenId);
        } else {
            response = await fetch("http://localhost:3000/offers/citizen");

        }

        return await response.json(); // Return the data
    },
    async logout() {
            await fetch("http://localhost:3000/logout");
        window.location.href = "/";
    },
    debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        }
    },
    async fetchAnnouncements() {
        try {
            const response = await fetch('http://localhost:3000/announcements');

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },
    async fetchAnnouncement(announcementId) {
        try {
            const response = await fetch('http://localhost:3000/announcements/' + announcementId);

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },
    async postOffer(newOffer) {
        await fetch('http://localhost:3000/offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOffer),
        });
    },

    async cancelOffer(offerId) {
        try {
            const response = await fetch(`http://localhost:3000/offers/${offerId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete the offer.');
            }
            return true;
        } catch (error) {
            console.error("Error on cancel offer:", error);
            throw error;
        }
    },


};

export default apiUtils;
