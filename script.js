document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const initialCapitalInput = document.getElementById('initialCapital');
    const currentAgeInput = document.getElementById('currentAge');
    const annualInterestInput = document.getElementById('annualInterest');
    const monthlyContributionInput = document.getElementById('monthlyContribution');

    // Outputs
    const totalInvestedEl = document.getElementById('totalInvested');
    const totalInterestEl = document.getElementById('totalInterest');
    const finalCapitalEl = document.getElementById('finalCapital');

    let pieChart, lineChart;

    function initCharts() {
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Dinero Aportado', 'Intereses Generados'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#6366f1', '#10b981'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Outfit',
                                size: 14
                            },
                            padding: 20
                        }
                    },
                    title: {
                        display: true,
                        text: 'Composición del Capital Final',
                        font: {
                            family: 'Outfit',
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                cutout: '70%'
            }
        });

        const lineCtx = document.getElementById('lineChart').getContext('2d');
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Evolución del Capital',
                    data: [],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Evolución Año a Año',
                        font: {
                            family: 'Outfit',
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => value.toLocaleString('es-ES') + ' €'
                        },
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    function calculate() {
        const initialCapital = parseFloat(initialCapitalInput.value) || 0;
        const currentAge = parseInt(currentAgeInput.value) || 0;
        const annualInterestRate = (parseFloat(annualInterestInput.value) || 0) / 100;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const targetAge = 65;

        if (currentAge >= targetAge) {
            updateUI(initialCapital, 0, initialCapital, [], [initialCapital]);
            return;
        }

        const years = targetAge - currentAge;
        let totalInvested = initialCapital;
        let currentBalance = initialCapital;
        
        const labels = [currentAge];
        const balances = [initialCapital];

        // Annual compound interest calculation including monthly contributions
        // For simplicity and accuracy in visualization, we simulate year by year
        for (let year = 1; year <= years; year++) {
            // Contribution for the year
            const yearlyContribution = monthlyContribution * 12;
            totalInvested += yearlyContribution;

            // Balance at end of year: (Balance + Contribution) * (1 + Rate)
            // Note: This assumes contributions happen at start of year for simplicity of compound interest
            // or we can do monthly compounding for more accuracy:
            let tempBalance = currentBalance;
            for(let month = 1; month <= 12; month++) {
                tempBalance += monthlyContribution;
                tempBalance *= Math.pow(1 + annualInterestRate, 1/12);
            }
            currentBalance = tempBalance;

            labels.push(currentAge + year);
            balances.push(Math.round(currentBalance));
        }

        const totalEarned = currentBalance - totalInvested;

        updateUI(totalInvested, totalEarned, currentBalance, labels, balances);
    }

    function updateUI(invested, earned, final, labels, balances) {
        // Numbers
        totalInvestedEl.textContent = Math.round(invested).toLocaleString('es-ES') + ' €';
        totalInterestEl.textContent = Math.round(earned).toLocaleString('es-ES') + ' €';
        finalCapitalEl.textContent = Math.round(final).toLocaleString('es-ES') + ' €';

        // Pie Chart
        pieChart.data.datasets[0].data = [Math.round(invested), Math.round(earned)];
        pieChart.update();

        // Line Chart
        lineChart.data.labels = labels;
        lineChart.data.datasets[0].data = balances;
        lineChart.update();
    }

    // Event Listeners
    [initialCapitalInput, currentAgeInput, annualInterestInput, monthlyContributionInput].forEach(input => {
        input.addEventListener('input', calculate);
    });

    initCharts();
    calculate();
});
