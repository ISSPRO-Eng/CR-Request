document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('main-form');
  const downloadBtn = document.querySelector('button[type="submit"]');

  function setupToggle({ trigger, triggerType = 'value', showValue = 'yes', target, requiredFields = [], displayType = 'block', callback }) {
    const triggerElement = document.getElementById(trigger);
    if (!triggerElement) return;
  
    const toggle = () => {
      const value = triggerType === 'checked' ? triggerElement.checked : triggerElement.value;
      const match = Array.isArray(showValue) ? showValue.includes(value) : (value === showValue);
  
      const targets = Array.isArray(target) ? target : [target];
      targets.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.display = match ? displayType : 'none';
        }
      });
  
      requiredFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.required = match;
      });
  
      // Run any custom logic (like clearing/reseting values)
      if (typeof callback === 'function') {
        callback(match);
      }
    };
  
    triggerElement.addEventListener('change', toggle);
    toggle(); // Initialize on load
  }

  function generateSignalTable() {
    const container = document.getElementById('generatedSignalTableContainer');
    container.innerHTML = ''; // Clear previous table

    const table = document.createElement('table');
    table.className = 'signal-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th></th>
        <th>Signal</th>
        <th>Wire Color</th>
        <th>Connector Cavity Position</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const rows = [
        { req: 'Req', signal: 'Sender (Voltage In)', required: true },
        { req: 'Opt', signal: 'Voltage Output' },
        { req: 'Req', signal: 'Ground', required: true },
        { req: 'Opt', signal: 'Alarm' },
        { req: 'Opt', signal: 'Alarm' }
    ];

    rows.forEach((rowData, index) => {
        const tr = document.createElement('tr');

        const tdReq = document.createElement('td');
        tdReq.textContent = rowData.req;
        tr.appendChild(tdReq);

        const tdSignal = document.createElement('td');
        if (rowData.signal === 'Sender (Voltage In)' || rowData.signal === 'Ground') {
          tdSignal.innerHTML = `${rowData.signal}<span class="required">*</span>`;
        }
        else {
            tdSignal.textContent = rowData.signal;
        }
        tr.appendChild(tdSignal);

        const tdColor = document.createElement('td');
        const inputColor = document.createElement('input');
        inputColor.type = 'text';
        inputColor.name = `wireColor${index}`;
        if (rowData.required) inputColor.required = true;
        tdColor.appendChild(inputColor);
        tr.appendChild(tdColor);

        const tdCavity = document.createElement('td');
        const inputCavity = document.createElement('input');
        inputCavity.type = 'text';
        inputCavity.name = `connectorPosition${index}`;
        if (rowData.required) inputCavity.required = true;
        tdCavity.appendChild(inputCavity);
        tr.appendChild(tdCavity);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
    container.style.display = 'block';
}

  // Configuration for all your dynamic sections
  const toggles = [
    {
      trigger: 'addContactDropdown',
      showValue: 'yes',
      target: 'additionalContact1',
      requiredFields: ['additionalContact1Name', 'additionalContact1Title', 'additionalContact1Email', 'additionalContact1Phone'],
    },
    {
      trigger: 'requirePrototypes',
      showValue: 'yes',
      target: 'prototypeCountContainer',
      requiredFields: ['prototypeCount'],
      displayType: 'flex'
    },
    {
      trigger: 'otherDocs',
      triggerType: 'checked',
      target: 'otherDocsCommentContainer'
    },
    {
      trigger: 'ppapRequired',
      showValue: 'Yes',
      target: 'ppapLevelGroup',
      displayType: 'flex'
    },
    {
      trigger: 'partDesign',
      showValue: 'ModifyPartNumber',
      target: 'modificationDetails',
      requiredFields: ['existingPartNumber', 'newPartNumber', 'modificationRequested']
    },
    {
      trigger: 'partDesign',
      showValue: 'NewDesign',
      target: 'newDetails',
      requiredFields: ['clientPartNumber', 'senderLength', 'senderLengthUnits', 'fluidUsage', 'fullestPoint', 
                       'pressurizedTank', 'emptyPoint', 'boltPattern', 'mountingFasteners', 'capProfile']
    },
    {
      trigger: 'fluidUsage',
      showValue: 'Other',
      target: 'fluidUsageDetails',
      requiredFields: ['fluidUsageDetailsInput'],
      displayType: 'flex'
    },
    {
      trigger: 'fullestPoint',
      showValue: 'Other',
      target: 'fullestPointDetails',
      requiredFields: ['fullestPointSpecify', 'fullestPointUnits']
    },
    {
      trigger: 'pressurizedTank',
      showValue: 'Yes',
      target: 'pressureUnitGroup',
      requiredFields: ['pressureUnit'],
      displayType: 'flex'
    },
    {
      trigger: 'emptyPoint',
      showValue: 'Other',
      target: 'emptyPointDetails',
      requiredFields: ['emptyPointSpecify', 'emptyPointUnits']
    },
    {
      trigger: 'boltPattern',
      showValue: 'Other',
      target: 'otherBoltPatternGroup',
      requiredFields: ['otherBoltPattern'],
      displayType: 'flex'
    },
    {
      trigger: 'mountingFasteners',
      showValue: 'Other',
      target: 'mountingFastenersOtherContainer',
      requiredFields: ['mountingFastenersOtherInput'],
      displayType: 'flex'
    },
    {
      trigger: 'fluidMovement',
      showValue: ['Return Only', 'Supply and Return'], // <-- both values!
      target: 'returnOnlyDetails',
      requiredFields: ['returnFittingDetails', 'returnTubeLength', 'returnTubeLengthUnits'],
      displayType: 'block'
    },
    {
      trigger: 'fluidMovement',
      showValue: 'Supply and Return', // <-- only Supply and Return
      target: 'supplyAndReturnDetails',
      requiredFields: ['supplyFittingDetails', 'supplyTubeLength', 'supplyTubeLengthUnits', 'supplyFilterDetails'],
      displayType: 'block'
    },
    {
      trigger: 'connectorType',
      showValue: 'Other',
      target: 'connectorOtherContainer',
      requiredFields: ['connectorOtherInput'],
      displayType: 'flex'
    },
    {
      trigger: 'senderOutput',
      showValue: 'Resistance',
      target: 'resistanceSenderOptions',
      requiredFields: ['resistanceAtFull', 'resistanceAtEmpty', 'customResistance'],
      displayType: 'block'
    },
    {
      trigger: 'senderOutput',
      showValue: 'Voltage',
      target: 'voltageSenderOptions',
      requiredFields: ['voltageAtFull', 'voltageAtEmpty'],
      displayType: 'block'
    },
    {
      trigger: 'customResistance',
      showValue: 'Yes',
      target: 'customResistanceOptions',
      requiredFields: ['tableStepCount'],
      displayType: 'block',
      callback: (isMatch) => {
        const stepInput = document.getElementById('tableStepCount');
        const tableContainer = document.getElementById('generatedResistanceTableContainer');
    
        if (!isMatch) {
          stepInput.value = '';
          tableContainer.innerHTML = '';
          tableContainer.style.display = 'none';
        }
      }
    }
  ];

  toggles.forEach(setupToggle);

  // Special case for fluid usage (Other, Biodiesel, HighOctaneEthanol)
  const fluidUsageSelect = document.getElementById('fluidUsage');
  const fluidUsageDetails = document.getElementById('fluidUsageDetails');
  const fluidUsageDetailsInput = document.getElementById('fluidUsageDetailsInput');

  fluidUsageSelect.addEventListener('change', () => {
    const value = fluidUsageSelect.value;
    if (['Biodiesel', 'HighOctaneEthanol', 'Other'].includes(value)) {
      fluidUsageDetails.style.display = 'flex';
      fluidUsageDetailsInput.required = true;
    } else {
      fluidUsageDetails.style.display = 'none';
      fluidUsageDetailsInput.required = false;
      fluidUsageDetailsInput.value = '';
    }
  });

    // Special case for Custom Resistance Table
  document.getElementById('tableStepCount').addEventListener('input', function () {
    const steps = parseInt(this.value);
    const tableContainer = document.getElementById('generatedResistanceTableContainer');
    tableContainer.innerHTML = '';

    if (isNaN(steps) || steps < 2) {
        tableContainer.style.display = 'none';
        return;
    }

    let table = document.createElement('table');
    table.className = 'custom-resistance-table';

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>LEVEL</th><th>OHMS</th>';
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement('tbody');

    for (let i = 0; i < steps; i++) {
        let row = document.createElement('tr');

        let levelCell = document.createElement('td');
        let ohmsCell = document.createElement('td');

        let levelInput = document.createElement('input');
        levelInput.type = 'text';
        levelInput.name = `level_${i}`;
        levelInput.required = true;

        let ohmsInput = document.createElement('input');
        ohmsInput.type = 'text';
        ohmsInput.name = `ohms_${i}`;
        ohmsInput.required = true;

        if (i === 0) {
            levelInput.value = 'FULL';
        } else if (i === steps - 1) {
            levelInput.value = 'EMPTY';
        }

        levelCell.appendChild(levelInput);
        ohmsCell.appendChild(ohmsInput);

        row.appendChild(levelCell);
        row.appendChild(ohmsCell);

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    tableContainer.style.display = 'block';
});

  // === Your existing PDF generation and validation below ===

  function generatePDF(formData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
  
    const formatKey = key => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('ISSPRO CR Request Summary', 10, y);
    y += 10;
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
  
    formData.forEach((value, key) => {
      const keyLabel = `${formatKey(key)}: `;
      let textValue = value instanceof File ? value.name : value;
    
      if (textValue === null || textValue === undefined || textValue === '') {
        textValue = 'N/A';
      }
    
      const splitText = doc.splitTextToSize(`${keyLabel}${textValue}`, 180);
      doc.text(splitText, 10, y);
      y += splitText.length * 8;
    
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
  
    const addFooters = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 200, 290, null, null, 'right');
      }
    };
  
    addFooters();
    doc.save('ISSPRO_CR_Request.pdf');
  }

  function validateForm() {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let missingFields = [];
    let firstInvalidField = null;
  
    requiredFields.forEach(field => {
      // Reset previous styles
      field.style.border = '';
  
      if (!field.value.trim()) {
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
        isValid = false;
        missingFields.push(field.name || field.id);
        // Add red border
        field.style.border = '2px solid red';
      }
    });
  
    if (!isValid) {
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidField.focus();
      alert('Please fill in the following required fields: ' + missingFields.join(', '));
    }
  
    return isValid;
  }

  // Replace this selector with your actual Generate PDF button's ID or class
document.getElementById('generate-pdf-btn').addEventListener('click', function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const formData = new FormData(form);
  generatePDF(formData);
  document.getElementById('customAlert').style.display = 'block';
});

// Modal close actions
document.querySelector('.close').addEventListener('click', function () {
  document.getElementById('customAlert').style.display = 'none';
});

document.getElementById('modal-ok-btn').addEventListener('click', function () {
  document.getElementById('customAlert').style.display = 'none';
});

// Close modal if user clicks outside content
window.addEventListener('click', function (event) {
  const modal = document.getElementById('customAlert');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

  generateSignalTable();
});