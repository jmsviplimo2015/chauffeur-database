document.addEventListener('DOMContentLoaded', () => {
    const chauffeurModal = document.getElementById('chauffeurModal');
    const addNewChauffeurBtn = document.getElementById('addNewChauffeurBtn');
    const closeButton = document.querySelector('.close-button');
    const chauffeurForm = document.getElementById('chauffeurForm');
    const chauffeurTableBody = document.getElementById('chauffeurTableBody');
    const modalTitle = document.getElementById('modalTitle');
    const saveChauffeurBtn = document.getElementById('saveChauffeurBtn');
    const chauffeurIdInput = document.getElementById('chauffeurIdInput'); // Reference to the hidden input field

    const filterNameInput = document.getElementById('filterName');
    const filterVehicleInput = document.getElementById('filterVehicle');
    const filterCityInput = document.getElementById('filterCity');
    const filterStatusSelect = document.getElementById('filterStatus');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    // Load chauffeurs from localStorage or initialize with sample data
    let chauffeurs = JSON.parse(localStorage.getItem('jms_chauffeursDB')) || [
        // Sample Data (can be removed or updated with new ID format if needed)
        { id: 'JMSC_24-001', name: 'John Doe', phone: '555-1234', email: 'john.doe@example.com', addressStreet: '123 Main St', addressCity: 'New York', addressState: 'NY', addressZip: '10001', vehicleType: 'Sedan - Mercedes S550', plateType: 'Livery', plateNo: 'XYZ123', status: 'Active', notes: 'Preferred for VIP airport runs.' },
        { id: 'JMSC_24-002', name: 'Jane Smith', phone: '555-5678', email: 'jane.smith@example.com', addressStreet: '456 Oak Ave', addressCity: 'Los Angeles', addressState: 'CA', addressZip: '90001', vehicleType: 'SUV - Cadillac Escalade', plateType: 'Commercial', plateNo: 'ABC789', status: 'Emergency Only', notes: 'Speaks Spanish fluently.' },
        { id: 'JMSC_24-003', name: 'Mike Brown', phone: '555-9012', email: 'mike.brown@example.com', addressStreet: '789 Pine Ln', addressCity: 'New York', addressState: 'NY', addressZip: '10002', vehicleType: 'Van - Mercedes Sprinter', plateType: 'Livery', plateNo: 'SPR456', status: 'Banned', notes: 'Reason for ban: Multiple customer complaints.' }
    ];

    function saveChauffeurs() {
        localStorage.setItem('jms_chauffeursDB', JSON.stringify(chauffeurs));
    }

    function generateChauffeurId() {
        const currentYear = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year (e.g., "25")
        const localStorageKey = `jms_lastChauffeurNumber_${currentYear}`;
        
        let lastNumber = 0;
        const storedLastNumber = localStorage.getItem(localStorageKey);
        if (storedLastNumber) {
            lastNumber = parseInt(storedLastNumber);
        }
        
        lastNumber++;
        localStorage.setItem(localStorageKey, lastNumber.toString());

        const formattedNumber = lastNumber.toString().padStart(3, '0'); // e.g., 001, 010, 100
        return `JMSC_${currentYear}-${formattedNumber}`;
    }

    function getStatusClass(status) {
        if (!status) return '';
        return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
    }

    function renderTable() {
        chauffeurTableBody.innerHTML = ''; // Clear existing rows

        const nameFilter = filterNameInput.value.toLowerCase();
        const vehicleFilter = filterVehicleInput.value.toLowerCase();
        const cityFilter = filterCityInput.value.toLowerCase();
        const statusFilter = filterStatusSelect.value;

        const filteredChauffeurs = chauffeurs.filter(chauffeur => {
            const matchesName = chauffeur.name.toLowerCase().includes(nameFilter);
            const matchesVehicle = chauffeur.vehicleType.toLowerCase().includes(vehicleFilter);
            const matchesCity = chauffeur.addressCity.toLowerCase().includes(cityFilter);
            const matchesStatus = statusFilter ? chauffeur.status === statusFilter : true;
            return matchesName && matchesVehicle && matchesCity && matchesStatus;
        });

        if (filteredChauffeurs.length === 0) {
            const row = chauffeurTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 11; // Updated colspan (10 fields + 1 actions)
            cell.textContent = 'No chauffeurs found matching your criteria.';
            cell.style.textAlign = 'center';
            return;
        }

        filteredChauffeurs.forEach(chauffeur => {
            const row = chauffeurTableBody.insertRow();
            row.className = getStatusClass(chauffeur.status);

            row.insertCell().textContent = chauffeur.id;
            row.insertCell().textContent = chauffeur.name;
            row.insertCell().textContent = chauffeur.phone;
            row.insertCell().textContent = chauffeur.email;
            row.insertCell().textContent = `${chauffeur.addressStreet}, ${chauffeur.addressCity}, ${chauffeur.addressState} ${chauffeur.addressZip}`;
            row.insertCell().textContent = chauffeur.vehicleType;
            row.insertCell().textContent = chauffeur.plateType;
            row.insertCell().textContent = chauffeur.plateNo;
            row.insertCell().textContent = chauffeur.status;
            row.insertCell().textContent = chauffeur.notes || ''; // Display notes, or empty string if none

            const actionsCell = row.insertCell();
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('action-btn', 'edit-btn');
            editBtn.onclick = () => openEditModal(chauffeur.id);
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('action-btn', 'delete-btn');
            deleteBtn.onclick = () => deleteChauffeur(chauffeur.id);
            actionsCell.appendChild(deleteBtn);
        });
    }

    function openAddModal() {
        modalTitle.textContent = 'Add New Chauffeur';
        saveChauffeurBtn.textContent = 'Save Chauffeur';
        chauffeurForm.reset();
        chauffeurIdInput.value = ''; // Clear hidden ID field
        document.getElementById('notes').value = ''; // Ensure notes field is cleared
        chauffeurModal.style.display = 'block';
    }

    function openEditModal(idToEdit) {
        const chauffeur = chauffeurs.find(c => c.id === idToEdit);
        if (!chauffeur) return;

        modalTitle.textContent = 'Edit Chauffeur';
        saveChauffeurBtn.textContent = 'Update Chauffeur';

        chauffeurIdInput.value = chauffeur.id;
        document.getElementById('name').value = chauffeur.name;
        document.getElementById('phone').value = chauffeur.phone;
        document.getElementById('email').value = chauffeur.email;
        document.getElementById('addressStreet').value = chauffeur.addressStreet;
        document.getElementById('addressCity').value = chauffeur.addressCity;
        document.getElementById('addressState').value = chauffeur.addressState;
        document.getElementById('addressZip').value = chauffeur.addressZip;
        document.getElementById('vehicleType').value = chauffeur.vehicleType;
        document.getElementById('plateType').value = chauffeur.plateType;
        document.getElementById('plateNo').value = chauffeur.plateNo;
        document.getElementById('status').value = chauffeur.status;
        document.getElementById('notes').value = chauffeur.notes || ''; // Populate notes

        chauffeurModal.style.display = 'block';
    }

    function closeModal() {
        chauffeurModal.style.display = 'none';
    }

    chauffeurForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentChauffeurId = chauffeurIdInput.value;
        const chauffeurData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            addressStreet: document.getElementById('addressStreet').value,
            addressCity: document.getElementById('addressCity').value,
            addressState: document.getElementById('addressState').value,
            addressZip: document.getElementById('addressZip').value,
            vehicleType: document.getElementById('vehicleType').value,
            plateType: document.getElementById('plateType').value,
            plateNo: document.getElementById('plateNo').value,
            status: document.getElementById('status').value,
            notes: document.getElementById('notes').value, // Get notes data
        };

        if (currentChauffeurId) { // Editing existing chauffeur
            const index = chauffeurs.findIndex(c => c.id === currentChauffeurId);
            if (index !== -1) {
                // Preserve the original ID, merge other data
                chauffeurs[index] = { ...chauffeurs[index], ...chauffeurData };
            }
        } else { // Adding new chauffeur
            chauffeurData.id = generateChauffeurId();
            chauffeurs.push(chauffeurData);
        }

        saveChauffeurs();
        renderTable();
        closeModal();
    });

    function deleteChauffeur(idToDelete) {
        if (confirm('Are you sure you want to delete this chauffeur?')) {
            chauffeurs = chauffeurs.filter(c => c.id !== idToDelete);
            saveChauffeurs();
            renderTable();
        }
    }

    // Event Listeners
    addNewChauffeurBtn.onclick = openAddModal;
    closeButton.onclick = closeModal;
    window.onclick = (event) => { // Close modal if clicked outside
        if (event.target == chauffeurModal) {
            closeModal();
        }
    };

    filterNameInput.addEventListener('input', renderTable);
    filterVehicleInput.addEventListener('input', renderTable);
    filterCityInput.addEventListener('input', renderTable);
    filterStatusSelect.addEventListener('change', renderTable);

    clearFiltersBtn.addEventListener('click', () => {
        filterNameInput.value = '';
        filterVehicleInput.value = '';
        filterCityInput.value = '';
        filterStatusSelect.value = '';
        renderTable();
    });

    // Initial render of the table
    renderTable();
});
