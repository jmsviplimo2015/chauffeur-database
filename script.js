document.addEventListener('DOMContentLoaded', () => {
    const chauffeurModal = document.getElementById('chauffeurModal');
    const addNewChauffeurBtn = document.getElementById('addNewChauffeurBtn');
    const closeButton = document.querySelector('.close-button');
    const chauffeurForm = document.getElementById('chauffeurForm');
    const chauffeurTableBody = document.getElementById('chauffeurTableBody');
    const modalTitle = document.getElementById('modalTitle');
    const saveChauffeurBtn = document.getElementById('saveChauffeurBtn');

    const filterNameInput = document.getElementById('filterName');
    const filterVehicleInput = document.getElementById('filterVehicle');
    const filterCityInput = document.getElementById('filterCity');
    const filterStatusSelect = document.getElementById('filterStatus');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    // Load chauffeurs from localStorage or initialize with sample data
    let chauffeurs = JSON.parse(localStorage.getItem('chauffeurs')) || [
        // Sample Data (can be removed if not needed)
        { id: 'CHAUF_1715100000001', name: 'John Doe', phone: '555-1234', email: 'john.doe@example.com', addressStreet: '123 Main St', addressCity: 'New York', addressState: 'NY', addressZip: '10001', vehicleType: 'Sedan - Mercedes S550', plateType: 'Livery', plateNo: 'XYZ123', status: 'Active' },
        { id: 'CHAUF_1715100000002', name: 'Jane Smith', phone: '555-5678', email: 'jane.smith@example.com', addressStreet: '456 Oak Ave', addressCity: 'Los Angeles', addressState: 'CA', addressZip: '90001', vehicleType: 'SUV - Cadillac Escalade', plateType: 'Commercial', plateNo: 'ABC789', status: 'Emergency Only' },
        { id: 'CHAUF_1715100000003', name: 'Mike Brown', phone: '555-9012', email: 'mike.brown@example.com', addressStreet: '789 Pine Ln', addressCity: 'New York', addressState: 'NY', addressZip: '10002', vehicleType: 'Van - Mercedes Sprinter', plateType: 'Livery', plateNo: 'SPR456', status: 'Banned' }
    ];

    function saveChauffeurs() {
        localStorage.setItem('chauffeurs', JSON.stringify(chauffeurs));
    }

    function generateChauffeurId() {
        return 'CHAUF_' + Date.now(); // Simple unique ID based on timestamp
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
            cell.colSpan = 10; // Number of columns
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
        document.getElementById('chauffeurId').value = ''; // Clear hidden ID field
        chauffeurModal.style.display = 'block';
    }

    function openEditModal(chauffeurId) {
        const chauffeur = chauffeurs.find(c => c.id === chauffeurId);
        if (!chauffeur) return;

        modalTitle.textContent = 'Edit Chauffeur';
        saveChauffeurBtn.textContent = 'Update Chauffeur';

        document.getElementById('chauffeurId').value = chauffeur.id;
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

        chauffeurModal.style.display = 'block';
    }

    function closeModal() {
        chauffeurModal.style.display = 'none';
    }

    chauffeurForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const id = document.getElementById('chauffeurId').value;
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
        };

        if (id) { // Editing existing chauffeur
            const index = chauffeurs.findIndex(c => c.id === id);
            if (index !== -1) {
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

    function deleteChauffeur(chauffeurId) {
        if (confirm('Are you sure you want to delete this chauffeur?')) {
            chauffeurs = chauffeurs.filter(c => c.id !== chauffeurId);
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
