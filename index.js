const API = "https://api.calculator312.online"
function toggleInputs() {
    var birdəfəlikOdenis = document.getElementById('birdəfəlikOdenis');
    var müddətliOdenis = document.getElementById('müddətliOdenis');
    var odenisTipi = document.querySelector('input[name="odenisTipi"]:checked').value;

    if (odenisTipi === 'birdəfəlik') {
        birdəfəlikOdenis.style.display = 'block';
        müddətliOdenis.style.display = 'none';
        fetchData();
        function fetchData() {
            // Fetch User Group data
            fetch(`${API}/api/UserGroup`)
                .then(response => response.json())
                .then(data => {
                    const userGroupSelect = document.getElementById('istifadeciQrupu');
                    const userGroupSelectM = document.getElementById('istifadeciQrupuM');
                    userGroupSelect.innerHTML = '<option value="" disabled selected>Qrup seçin</option>';

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

            fetch(`${API}/api/ServiceType?payment_type_id=1`)
                .then(response => response.json())
                .then(data => {
                    const userGroupSelect = document.getElementById('xidmetNovu');
                    userGroupSelect.innerHTML = '<option value="" disabled selected>Xidmət Növünü Seçin</option>';
                    data.forEach(group => {
                        const option = document.createElement('option');
                        option.value = group.id;
                        option.textContent = group.name;
                        userGroupSelect.appendChild(option);
                    });
                    console.log(data);
                })
                .catch(error => console.error('Error fetching Service Type data:', error));

            fetch(`${API}/api/B4`)
                .then(response => response.json())
                .then(data => {
                    const userGroupSelect = document.getElementById('coğrafiEmsal');
                    userGroupSelect.innerHTML = '<option value="" disabled selected>Ərazini seçin</option>';
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
        document.getElementById('radioTezlikSayi').addEventListener('input', (event) => {
            const inputValue = event.target.value;
            const b2Label = document.getElementById('B2Label');

            // Update the B2 label to show the input value
            b2Label.textContent = `B2 ${inputValue}`;
        });

        function fetchDataServiceId(serviceTypeId) {
            fetch(`${API}/api/OneTimePaymentB1B3B5?service_type_id=${serviceTypeId}`)
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
            fetch(`${API}/api/OneTimePayment`, {
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


    } else if (odenisTipi === 'müddətli') {
        müddətliOdenis.style.display = 'block';
        birdəfəlikOdenis.style.display = 'none';

        fetch(`${API}/api/ServiceType?payment_type_id=2`)
            .then(response => response.json())
            .then(data => {
                const userGroupSelect = document.getElementById('serviceType');
                userGroupSelect.innerHTML = '<option value="" disabled selected>Xidmət Növü Seçin</option>';
                data.forEach(group => {
                    const option = document.createElement('option');
                    option.value = group.id;
                    option.textContent = group.name;
                    option.dataset.demoValue = group.id == 18 ? '2' : (group.id == 20 || group.id == 22 || group.id == 25 || group.id == 26 || group.id == 27 || group.id == 28 || group.id == 37 || group.id == 38 || group.id == 39 || group.id == 40 || group.id == 41 || group.id == 42 ? '3' : '1');
                    userGroupSelect.appendChild(option);
                });
                console.log(data);
            })
            .catch(error => console.error('Error fetching Service Type data:', error));

        document.getElementById("serviceType").addEventListener("change", function (event) {
            const selectedOption = document.querySelector('#serviceType option:checked');
            if (selectedOption.getAttribute('data-demo-value') === "1" || selectedOption.getAttribute('data-demo-value') === "3") {
                document.getElementById("input1").style.display = 'block';
                document.getElementById("input2").style.display = 'none';


                fetchDataOther();
                function fetchDataOther() {
                    // Fetch User Group data
                    fetch(`${API}/api/UserGroup`)
                        .then(response => response.json())
                        .then(data => {
                            const userGroupSelect = document.getElementById('istifadeciQrupuM');
                            userGroupSelect.innerHTML = '<option value="" disabled selected>Qrup seçin</option>';
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

                    fetch(`${API}/api/B4`)
                        .then(response => response.json())
                        .then(data => {
                            const userGroupSelect = document.getElementById('coğrafiEmsalM');
                            userGroupSelect.innerHTML = '<option value="" disabled selected>Zona seçin</option>';
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
                                const emsalSpan = document.getElementById('m4Label');

                                // Display both group name and coefficient in the span
                                emsalSpan.textContent = `M4 ${selectedCoefficient}` || 'null is data';
                            });

                            console.log(data);
                        })
                        .catch(error => console.error('Error fetching B4 data:', error));
                }

                const serviceTypeOtherId = event.target.value;
                fetchDataServiceOtherId(serviceTypeOtherId);


                function fetchDataServiceOtherId(serviceTypeOtherId) {
                    fetch(`${API}/api/OtherTermPaymentM1M3M5M6M7?service_type_id=${serviceTypeOtherId}`)
                        .then(response => response.json())
                        .then(data => {
                            const m1 = data.m1;
                            const m3 = data.m3;
                            const m6 = data.m6;
                            const m7 = data.m7;
                            const r = data.r;


                            const m1Select = document.getElementById('odenisDeyeriM');
                            m1Select.innerHTML = '<option value="">Seçin</option>'; // Mövcud seçimləri təmizləyirik

                            m1.forEach(option => {
                                const optionElement = document.createElement('option');
                                optionElement.value = option.id;
                                optionElement.setAttribute('data-coefficient', option.coefficient); // Burada data-coefficient atributunu əlavə edirik
                                optionElement.textContent = `${option.name}`;
                                console.log(optionElement);

                                m1Select.appendChild(optionElement);
                            });
                            m1Select.addEventListener('change', function () {
                                const selectedOption = m1Select.options[m1Select.selectedIndex];
                                const coefficient = selectedOption ? selectedOption.getAttribute('data-coefficient') : 0;
                                document.getElementById('m1Label').textContent = `M1: ${coefficient}`;
                            });


                            const m3Select = document.getElementById('zolaqGensliyi');
                            m3Select.innerHTML = '<option value="">Seçin</option>'; // Mövcud seçimləri təmizləyirik

                            m3.forEach(option => {
                                const optionElement = document.createElement('option');
                                optionElement.value = option.id;
                                optionElement.setAttribute('data-coefficient', option.coefficient); // Burada data-coefficient atributunu əlavə edirik
                                optionElement.textContent = `${option.name}`;
                                console.log(optionElement);

                                m3Select.appendChild(optionElement);
                            });
                            m3Select.addEventListener('change', function () {
                                const selectedOption = m3Select.options[m1Select.selectedIndex];
                                const coefficient = selectedOption ? selectedOption.getAttribute('data-coefficient') : 0;
                                document.getElementById('m3Label').textContent = `M3: ${coefficient}`;
                            });

                            const m6Select = document.getElementById('tekanSahesi');
                            m6Select.innerHTML = '<option value="">Seçin</option>'; // Mövcud seçimləri təmizləyirik

                            m6.forEach(option => {
                                const optionElement = document.createElement('option');
                                optionElement.value = option.id;
                                optionElement.setAttribute('data-coefficient', option.coefficient); // Burada data-coefficient atributunu əlavə edirik
                                optionElement.textContent = `${option.name}`;
                                console.log(optionElement);

                                m6Select.appendChild(optionElement);
                            });
                            m6Select.addEventListener('change', function () {
                                const selectedOption = m6Select.options[m6Select.selectedIndex];
                                const coefficient = selectedOption ? selectedOption.getAttribute('data-coefficient') : 0;
                                document.getElementById('m6Label').textContent = `M6: ${coefficient}`;
                            });


                            const m7Select = document.getElementById('tezlikEmsali');
                            m7Select.innerHTML = '<option value="">Seçin</option>'; // Mövcud seçimləri təmizləyirik

                            m7.forEach(option => {
                                const optionElement = document.createElement('option');
                                optionElement.value = option.id;
                                optionElement.setAttribute('data-coefficient', option.coefficient); // Burada data-coefficient atributunu əlavə edirik
                                optionElement.textContent = `${option.name}`;
                                console.log(optionElement);

                                m7Select.appendChild(optionElement);
                            });
                            m7Select.addEventListener('change', function () {
                                const selectedOption = m7Select.options[m7Select.selectedIndex];
                                const coefficient = selectedOption ? selectedOption.getAttribute('data-coefficient') : 0;
                                document.getElementById('m7Label').textContent = `M7: ${coefficient}`;
                            });

                            const rSelect = document.getElementById('R');
                            rSelect.innerHTML = '<option value="">Seçin</option>'; // Mövcud seçimləri təmizləyirik

                            r.forEach(option => {
                                const optionElement = document.createElement('option');
                                optionElement.value = option.id;
                                optionElement.setAttribute('data-coefficient', option.coefficient); // Burada data-coefficient atributunu əlavə edirik
                                optionElement.textContent = `${option.name}`;
                                console.log(optionElement);

                                rSelect.appendChild(optionElement);
                            });
                            rSelect.addEventListener('change', function () {
                                const selectedOption = rSelect.options[rSelect.selectedIndex];
                                const coefficient = selectedOption ? selectedOption.getAttribute('data-coefficient') : 0;
                                document.getElementById('rLabel').textContent = `R: ${coefficient}`;
                            });


                            console.log(data);
                        })
                        .catch(error => console.error('Error fetching OneTimePaymentB1B3B5 data:', error));
                }

                // document.getElementById('serviceType').addEventListener('change', (event) => {
                //     const serviceTypeOtherId = event.target.value;
                //     fetchDataServiceOtherId(serviceTypeOtherId);
                // });

                document.getElementById('revSayi').addEventListener('input', (event) => {
                    const inputValue = event.target.value;
                    const m2Label = document.getElementById('m2Label');

                    m2Label.textContent = `M2 ${inputValue}`;
                });
                document.getElementById('tarixAraligi').addEventListener('input', (event) => {
                    const inputValue = event.target.value;
                    const m8Label = document.getElementById('m8Label');

                    m8Label.textContent = `M8: ${(inputValue*30 / 365).toFixed(2)}`;
                });

                document.getElementById('revSualandirici').addEventListener('input', function () {
                    const m5Value = this.value; // Input sahəsinə daxil edilən dəyər
                    const serviceType = document.getElementById('serviceType').value; // Seçilmiş serviceType
                    console.log(serviceType);


                    if (!m5Value || !serviceType) {
                        document.getElementById('m5Label').textContent = "M5";
                        return;
                    }

                    fetch(`${API}/api/M5`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "ServiceType": serviceType,
                            "M5": parseFloat(m5Value) // Dəyəri sayıya çeviririk
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            const coefficient = data.M5_coefficient || "Məlumat yoxdur";
                            document.getElementById('m5Label').textContent = `M5: ${coefficient}`;
                        })
                        .catch(error => {
                            console.error('Error fetching M5 coefficient:', error);
                            document.getElementById('m5Label').textContent = "Xəta baş verdi";
                        });
                });


                document.getElementById('submitBtn').addEventListener('click', () => {
                    const serviceType = document.getElementById('serviceType').value
                    const userQrup = document.getElementById('istifadeciQrupuM').value; // Get selected UserQrup (Service Type)
                    const M1 = document.getElementById('odenisDeyeriM').value; // Get B1 dataid
                    const M2 = document.getElementById('revSayi').value; // Get B2 value (Radio Frequency Count)
                    const M3 = document.getElementById('zolaqGensliyi').value; // Get B3 dataid
                    const M4 = document.getElementById('coğrafiEmsalM').value; // Get selected value from B4 dropdown
                    const M5 = document.getElementById('revSualandirici').value; // Get B5 dataid
                    const M6 = document.getElementById('tekanSahesi').value;
                    const M7 = document.getElementById('tezlikEmsali').value;
                    const M8 = document.getElementById('tarixAraligi').value;
                    const rSelect = document.getElementById('R'); // R dropdown
                    const rValue = rSelect ? rSelect.value : null; // Seçilmiş dəyəri götür

                    // Construct the data object to send in the POST request
                    const dataToSend = {
                        "ServiceType": serviceType,
                        UserQrup: userQrup,
                        M1: M1,
                        M2: M2,
                        M3: M3,
                        M4: M4,
                        M5: M5,
                        M6: M6,
                        M7: M7,
                        M8: M8
                    };
                    console.log(dataToSend);
                    if (rValue) {
                        dataToSend.R = rValue;
                    }


                    // Send the POST request to the API
                    fetch(`${API}/api/OtherTermPayment`, {
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
                if (selectedOption.getAttribute('data-demo-value') === "3") {
                    document.getElementById("Rdiv").style.display = 'block';
                    document.getElementById("Rlabelid").style.display = 'block';
                }
                else {
                    document.getElementById("Rdiv").style.display = 'none';
                    document.getElementById("Rlabelid").style.display = 'none';
                }
            }
            else if (selectedOption.getAttribute('data-demo-value') === "2") {
                document.getElementById("input1").style.display = 'none';
                document.getElementById("input2").style.display = 'block';


                document.getElementById('submitBtn').addEventListener('click', () => {
                    const SGZ1 = document.getElementById('SZG1').value;
                    const SGZ2 = document.getElementById('SZG2').value;
                    const SGZ3 = document.getElementById('SZG3').value;
                    const SGZ4 = document.getElementById('SZG4').value;
                    const SGZ5 = document.getElementById('SZG5').value;
                    const SGZ6 = document.getElementById('SZG6').value;
                    const SGZ7 = document.getElementById('SZG7').value;
                    const DGZ1 = document.getElementById('DZG1').value;
                    const DGZ2 = document.getElementById('DZG2').value;
                    const DGZ3 = document.getElementById('DZG3').value;
                    const DGZ4 = document.getElementById('DZG4').value;
                    const DGZ5 = document.getElementById('DZG5').value;
                    const DGZ6 = document.getElementById('DZG6').value;
                    const DGZ7 = document.getElementById('DZG7').value;
                    const T = document.getElementById('tarixAraligiS').value;



                    // Construct the data object to send in the POST request
                    const dataToSend = {
                        SGZ1: SGZ1,
                        SGZ2: SGZ2,
                        SGZ3: SGZ3,
                        SGZ4: SGZ4,
                        SGZ5: SGZ5,
                        SGZ6: SGZ6,
                        SGZ7: SGZ7,
                        DGZ1: DGZ1,
                        DGZ2: DGZ2,
                        DGZ3: DGZ3,
                        DGZ4: DGZ4,
                        DGZ5: DGZ5,
                        DGZ6: DGZ6,
                        DGZ7: DGZ7,
                        T: T
                    };
                    console.log(dataToSend);


                    // Send the POST request to the API
                    fetch(`${API}/api/SellularTermPayment`, {
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

            }
        });
    }
}