import apiUtils from "../../utils/apiUtils.mjs";

const logoutButton = document.getElementById("logoutButton");


document.addEventListener('DOMContentLoaded', async () => {


    logoutButton.addEventListener("click", async () => {
        await apiUtils.logout()
    });
    const ctx = document.getElementById('statsChart').getContext('2d');
    let statsChart;

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const updateButton = document.getElementById('update-stats');

    updateButton.addEventListener('click', fetchAndUpdateStats);

    async function fetchAndUpdateStats() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        try {
            updateButton.disabled = true;
            updateButton.textContent = 'Updating...';

            const response = await fetch(`http://localhost:3000/admin/statistics/graph?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
            updateChart(data);
            updateTotalStats(data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            updateButton.disabled = false;
            updateButton.textContent = 'Update Statistics';
        }
    }

    function updateChart(data) {
        if (statsChart) {
            statsChart.destroy();
        }

        statsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Requests', 'Offers'],
                datasets: [
                    {
                        label: 'Completed',
                        data: [data.completed_requests, data.completed_offers],
                        backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    },
                    {
                        label: 'Not Completed',
                        data: [data.not_completed_requests, data.not_completed_offers],
                        backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Requests and Offers Statistics'
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeOutQuart'
                    }
                }
            }
        });
    }

    function updateTotalStats(data) {
        const totalStatsDiv = document.getElementById('total-stats');
        const totalRequests = data.completed_requests + data.not_completed_requests;
        const totalOffers = data.completed_offers + data.not_completed_offers;

        totalStatsDiv.innerHTML = `
            <p><strong>Total Requests:</strong> ${totalRequests}</p>
            <p><strong>Total Offers:</strong> ${totalOffers}</p>
            <p><strong>Earliest Date:</strong> ${new Date(data.earliest_date).toLocaleDateString()}</p>
        `;

        // Add a subtle animation
        totalStatsDiv.style.opacity = '0';
        setTimeout(() => {
            totalStatsDiv.style.transition = 'opacity 0.5s ease-in-out';
            totalStatsDiv.style.opacity = '1';
        }, 50);
    }

    // Set default dates
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    startDateInput.value = oneMonthAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];

    // Initial fetch
    fetchAndUpdateStats();
});
