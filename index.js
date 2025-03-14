function toggleInputs() {
    var birdəfəlikOdenis = document.getElementById('birdəfəlikOdenis');
    var müddətliOdenis = document.getElementById('müddətliOdenis');
    var odenisTipi = document.querySelector('input[name="odenisTipi"]:checked').value;

    if (odenisTipi === 'birdəfəlik') {
        birdəfəlikOdenis.style.display = 'block';
        müddətliOdenis.style.display = 'none';
    } else if (odenisTipi === 'müddətli') {
        müddətliOdenis.style.display = 'block';
        birdəfəlikOdenis.style.display = 'none';
    }
}
document.getElementById("serviceType").addEventListener("change", function () {
    if (this.value === "1") {
        document.getElementById("input1").style.display = 'block';
        document.getElementById("input2").style.display = 'none';
    }
    else if (this.value === "2") {
        document.getElementById("input1").style.display = 'none';
        document.getElementById("input2").style.display = 'block';
    }
});






function fetchData() {
    // Fetch User Group data
    fetch('http://127.0.0.1:8000/api/UserGroup')
        .then(response => response.json())
        .then(data => {
            const userGroupSelect = document.getElementById('istifadeciQrupu');
            const userGroupSelectM = document.getElementById('istifadeciQrupuM');
            data.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                option.coefficient = group.coefficient; // Store the coefficient in the option
                userGroupSelect.appendChild(option);
            });

            // Add event listener for the select element
            userGroupSelect.addEventListener('change', (event) => {
                const selectedOption = event.target.options[event.target.selectedIndex];
                const selectedGroupName = selectedOption ? selectedOption.textContent : '';
                const selectedCoefficient = selectedOption ? selectedOption.coefficient : '';
                const emsalSpan = document.getElementById('istifadeciQrupuSpan');

                // Display both group name and coefficient in the span
                emsalSpan.textContent = selectedCoefficient || 'null is data';
            });

            console.log(data);
        })
        .catch(error => console.error('Error fetching User Group data:', error));

    fetch('http://127.0.0.1:8000/api/ServiceType')
        .then(response => response.json())
        .then(data => {
            const userGroupSelect = document.getElementById('xidmetNovu');
            data.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                userGroupSelect.appendChild(option);
            });
            console.log(data);
        })
        .catch(error => console.error('Error fetching Service Type data:', error));

    fetch('http://127.0.0.1:8000/api/B4')
        .then(response => response.json())
        .then(data => {
            const userGroupSelect = document.getElementById('coğrafiEmsal');
            data.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                option.coefficient = group.coefficient;
                userGroupSelect.appendChild(option);
            });

            // Add event listener for the select element
            userGroupSelect.addEventListener('change', (event) => {
                const selectedOption = event.target.options[event.target.selectedIndex];
                const selectedCoefficient = selectedOption ? selectedOption.coefficient : '';
                const emsalSpan = document.getElementById('b4Label');

                // Display both group name and coefficient in the span
                emsalSpan.textContent = `B4 ${selectedCoefficient}` || 'null is data';
            });

            console.log(data);
        })
        .catch(error => console.error('Error fetching B4 data:', error));
}


window.onload = fetchData;
document.getElementById('radioTezlikSayi').addEventListener('input', (event) => {
    const inputValue = event.target.value;
    const b2Label = document.getElementById('B2Label');

    // Update the B2 label to show the input value
    b2Label.textContent = `B2 ${inputValue}`;
});

function fetchDataServiceId(serviceTypeId) {
    fetch(`http://127.0.0.1:8000/api/OneTimePaymentB1B3B5?service_type_id=${serviceTypeId}`)
        .then(response => response.json())
        .then(data => {
            // Update B1, B3, B5 labels and their corresponding input fields
            const b1 = data.b1;
            const b3 = data.b3;
            const b5 = data.b5;



            // Update the values for B1, B3, and B5
            document.getElementById('odenisDeyeri').value = b1.name || "select";
            document.getElementById('b1Label').textContent = `B1 ${b1.coefficient || "select"}`;
            document.getElementById('odenisDeyeri').setAttribute('dataid', b1.id || 'null');

            document.getElementById('zolaqEmsali').value = b3.name || "select";
            document.getElementById('b3Label').textContent = `B3 ${b3.coefficient || "select"}`;
            document.getElementById('zolaqEmsali').setAttribute('dataid', b3.id || 'null');

            document.getElementById('ehmiyyetlilikEmsali').value = b5.name || "select";
            document.getElementById('b5Label').textContent = `B5 ${b5.coefficient || "select"}`;
            document.getElementById('ehmiyyetlilikEmsali').setAttribute('dataid', b5.id || 'null');

            console.log(data);
        })
        .catch(error => console.error('Error fetching OneTimePaymentB1B3B5 data:', error));
}

document.getElementById('xidmetNovu').addEventListener('change', (event) => {
    const serviceTypeId = event.target.value;
    fetchDataServiceId(serviceTypeId);
});


document.getElementById('submitBtn').addEventListener('click', () => {
    const userQrup = document.getElementById('istifadeciQrupu').value; // Get selected UserQrup (Service Type)
    const B1 = document.getElementById('odenisDeyeri').getAttribute('dataid'); // Get B1 dataid
    const B2 = document.getElementById('radioTezlikSayi').value; // Get B2 value (Radio Frequency Count)
    const B3 = document.getElementById('zolaqEmsali').getAttribute('dataid'); // Get B3 dataid
    const B4 = document.getElementById('coğrafiEmsal').value; // Get selected value from B4 dropdown
    const B5 = document.getElementById('ehmiyyetlilikEmsali').getAttribute('dataid'); // Get B5 dataid


    // Construct the data object to send in the POST request
    const dataToSend = {
        UserQrup: userQrup,
        B1: B1,
        B2: B2,
        B3: B3,
        B4: B4,
        B5: B5
    };
    console.log(dataToSend);


    // Send the POST request to the API
    fetch('http://127.0.0.1:8000/api/OneTimePayment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            // Update the HTML elements with the response data
            document.getElementById('sum').value = data.Sum || '';  // Set Sum in the appropriate field
            document.getElementById('firstTotal').value = data.FirstTotal || '';  // Set FirstTotal in the appropriate field
            document.getElementById('taxTotal').value = data.TaxTotal || '';  // Set TaxTotal in the appropriate field

            console.log('Response from server:', data);
        })
        .catch(error => console.error('Error:', error));
});




///////////////////////////////////////////////



window.onload = fetchDataOther;
////////////////////////////////////////
function fetchDataOther() {
    // Fetch User Group data
    fetch('http://127.0.0.1:8000/api/UserGroup')
        .then(response => response.json())
        .then(data => {
            const userGroupSelect = document.getElementById('istifadeciQrupuM');
            data.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                option.coefficient = group.coefficient; // Store the coefficient in the option
                userGroupSelect.appendChild(option);
            });

            // Add event listener for the select element
            userGroupSelect.addEventListener('change', (event) => {
                const selectedOption = event.target.options[event.target.selectedIndex];
                const selectedGroupName = selectedOption ? selectedOption.textContent : '';
                const selectedCoefficient = selectedOption ? selectedOption.coefficient : '';
                const emsalSpan = document.getElementById('istifadeciQrupuSpanM');

                // Display both group name and coefficient in the span
                emsalSpan.textContent = selectedCoefficient || 'null is data';
            });

            console.log(data);
        })
        .catch(error => console.error('Error fetching User Group data:', error));

    fetch('http://127.0.0.1:8000/api/ServiceType')
        .then(response => response.json())
        .then(data => {
            const userGroupSelect = document.getElementById('serviceType');
            data.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                userGroupSelect.appendChild(option);
            });
            console.log(data);
        })
        .catch(error => console.error('Error fetching Service Type data:', error));

    fetch('http://127.0.0.1:8000/api/B4')
        .then(response => response.json())
        .then(data => {
            const userGroupSelect = document.getElementById('coğrafiEmsal');
            data.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                option.coefficient = group.coefficient;
                userGroupSelect.appendChild(option);
            });

            // Add event listener for the select element
            userGroupSelect.addEventListener('change', (event) => {
                const selectedOption = event.target.options[event.target.selectedIndex];
                const selectedCoefficient = selectedOption ? selectedOption.coefficient : '';
                const emsalSpan = document.getElementById('b4Label');

                // Display both group name and coefficient in the span
                emsalSpan.textContent = `B4 ${selectedCoefficient}` || 'null is data';
            });

            console.log(data);
        })
        .catch(error => console.error('Error fetching B4 data:', error));
}



function fetchDataServiceOtherId(serviceTypeOtherId) {
    fetch(`http://127.0.0.1:8000/api/OtherTermPaymentM1M3M5M6M7?service_type_id=${serviceTypeOtherId}`)
        .then(response => response.json())
        .then(data => {
            const m1 = data.m1;
            const m3 = data.m3;
            const m6 = data.m1;
            const m7 = data.m3;
            
   
            document.getElementById('odenisDeyeriM').value = m1.name || "select";
            document.getElementById('m1Label').textContent = `M1 ${m1.coefficient || "select"}`;
            document.getElementById('odenisDeyeriM').setAttribute('dataid', m1.id || 'null');

            document.getElementById('zolaqGensliyi').value = m3.name || "select";
            document.getElementById('m3Label').textContent = `M3 ${m3.coefficient || "select"}`;
            document.getElementById('zolaqGensliyi').setAttribute('dataid', m3.id || 'null');


            // document.getElementById('ehmiyyetlilikEmsali').value = m5.name || "select";
            // document.getElementById('b5Label').textContent = `M5 ${m5.coefficient || "select"}`;
            // document.getElementById('ehmiyyetlilikEmsali').setAttribute('dataid', m5.id || 'null');

            document.getElementById('ehmiyyetlilikEmsali').value = m7.name || "select";
            document.getElementById('b5Label').textContent = `M7 ${m7.coefficient || "select"}`;
            document.getElementById('ehmiyyetlilikEmsali').setAttribute('dataid', m7.id || 'null');

            console.log(data);
        })
        .catch(error => console.error('Error fetching OneTimePaymentB1B3B5 data:', error));
}

document.getElementById('serviceType').addEventListener('change', (event) => {
    const serviceTypeOtherId = event.target.value;
    fetchDataServiceOtherId(serviceTypeOtherId);
});