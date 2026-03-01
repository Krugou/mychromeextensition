document.getElementById('convertBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;
    const resultDiv = document.getElementById('result');

    if (isNaN(amount)) {
        resultDiv.textContent = "Invalid amount";
        return;
    }

    let result = 0;
    // Simple mock conversion rates
    if (from === 'USD' && to === 'EUR') result = amount * 0.92;
    else if (from === 'EUR' && to === 'USD') result = amount * 1.08;
    else if (from === 'MILES' && to === 'KM') result = amount * 1.60934;
    else if (from === 'KM' && to === 'MILES') result = amount / 1.60934;
    else result = amount;

    resultDiv.textContent = result.toFixed(2) + ' ' + to;
});
