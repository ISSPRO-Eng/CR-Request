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
        { signal: 'Sender (Voltage In)', required: true },
        { signal: 'Voltage Output' },
        { signal: 'Ground', required: true },
        { signal: 'Alarm' }
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
      target: 'otherDocsCommentContainer',
      requiredFields: ['otherDocsComment'],
      displayType: 'flex'
    },
    {
      trigger: 'ppapRequired',
      showValue: 'Yes',
      target: 'ppapLevelGroup',
      requiredFields: ['ppapLevels'],
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
                       'pressurizedTank', 'emptyPoint', 'boltPattern', 'mountingFasteners', 'capProfile', 'fluidMovement']
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
      requiredFields: ['pressureValue', 'pressureUnit'],
      displayType: 'block'
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
      showValue: 'Wire Harness',
      target: 'connectorHarnessLengthContainer',
      requiredFields: ['connectorHarnessLengthInput', 'connectorHarnessLengthUnits'],
      displayType: 'flex'
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

  // Special case for Quality Docs Other 
  const qualityDocsSelect = document.getElementById('qualityDocs');
  const otherDocsCommentContainer = document.getElementById('otherDocsCommentContainer');
  const otherDocsComment = document.getElementById('otherDocsComment');

  qualityDocsSelect.addEventListener('change', () => {
  const selectedOptions = Array.from(qualityDocsSelect.selectedOptions);
  const specialOptions = ['Other'];

  // Check if any selected option is in the special group
  const hasSpecialOption = selectedOptions.some(option => specialOptions.includes(option.value));

  if (hasSpecialOption) {
    otherDocsCommentContainer.style.display = 'flex';
    otherDocsComment.required = true;
  } else {
    otherDocsCommentContainer.style.display = 'none';
    otherDocsComment.required = false;
    otherDocsComment.value = '';
  }
});


  // Special case for fluid usage (Other, Biodiesel, HighOctaneEthanol)
  const fluidUsageSelect = document.getElementById('fluidUsage');
  const fluidUsageDetails = document.getElementById('fluidUsageDetails');
  const fluidUsageDetailsInput = document.getElementById('fluidUsageDetailsInput');

  fluidUsageSelect.addEventListener('change', () => {
  const selectedOptions = Array.from(fluidUsageSelect.selectedOptions);
  const specialOptions = ['Biodiesel', 'HighOctaneEthanol', 'Other'];

  // Check if any selected option is in the special group
  const hasSpecialOption = selectedOptions.some(option => specialOptions.includes(option.value));

  if (hasSpecialOption) {
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

function getValueFromElement(key) {
  const element = document.getElementById(key);
  if (!element) {
    console.warn(`No element found for key: ${key}`);
    return null;
  }

  if (element.type === 'checkbox') {
    return element.checked ? 'Yes' : 'No';
  }

  if (element.tagName === 'SELECT') {
    if (element.multiple) {
      const selected = Array.from(element.selectedOptions)
        .map(opt => opt.text.trim())
        .filter(Boolean);
      return selected.length > 0 ? selected.join(', ') : 'N/A';
    } else {
      const selectedOption = element.options[element.selectedIndex];
      return selectedOption?.value === '' ? 'N/A' : selectedOption.text.trim();
    }
  }

  return element.value?.trim() || element.textContent.trim() || 'N/A';
}

  // === Your existing PDF generation and validation below ===

  async function generatePDFAndZip(formData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
  
    const formatKey = key =>
      key
        .replace(/([a-z])([A-Z])/g, '$1 $2')   // Add space between camelCase
        .replace(/_/g, ' ')                    // Replace underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  
    // Define your sections with titles and keys
    const sections = [
      {
        title: "Company Information",
        keys: [
          "companyName", "companyAddress", "companyCityStateZip", "contactName", "contactTitle",
          "contactEmail", "contactPhone", "contactFax", "addContactDropdown",
          "additionalContact1Name", "additionalContact1Title", "additionalContact1Email", "additionalContact1Phone"
        ],
      },
      {
        title: "Shipping Information",
        keys: [
          "packagingReqs", "shippingReqs", "uploadDocs"
        ],
      },
      {
        title: "Product Timeline",
        keys: [
          "productionDate", "annualUsage", "requirePrototypes", "prototypeCount"
        ],
      },
      {
        title: "Quality Requirements",
        keys: [
          "qualityManagerName", "qualityManagerEmail", "qualityManagerPhone", "qualityManagerFax",
          "ppapRequired", "ppapLevels", "qualityDocs", "otherDocsComment", "qualityDocUpload"
        ],
      },
      {
        title: "Mechanical Requirements",
        keys: [
          "partDesign", "existingPartNumber", "newPartNumber", "modificationRequested", "modificationDocUpload",
          "clientPartNumber", "senderLength", "senderLengthUnits", "fluidUsage", "fluidUsageDetailsInput",
          "fullestPoint", "fullestPointSpecify", "fullestPointUnits", "pressurizedTank", "pressureValue",
          "pressureUnit", "emptyPoint", "emptyPointSpecify", "emptyPointUnits", "boltPattern", "otherBoltPattern",
          "mountingFasteners", "mountingFastenersOtherInput", "capProfile", "fluidMovement", "returnFittingDetails",
          "returnTubeLength", "returnTubeLengthUnits", "supplyFittingDetails", "supplyTubeLength",
          "supplyTubeLengthUnits", "supplyFilterDetails"
        ],
      },

      {
        title: "Sender Output Requirements",
        keys: [
          "connectorPN", "connectorType", "connectorHarnessLengthInput",
          "connectorHarnessLengthUnits", "connectorOtherInput", "connectorSupplier", "harnessLength",
          "harnessLengthUnits", "systemVoltage", "senderOutput", "resistanceAtFull", "resistanceAtEmpty",
          "customResistance", "tableStepCount", "voltageAtFull", "VoltageAtEmpty", "senderAlarms",
          "wireColor0", "connectorPosition0", "wireColor1", "connectorPosition1", "wireColor2",
          "connectorPosition2", "wireColor3", "connectorPosition3"
        ],
      },
      {
        title: "Additional Information",
        keys: [
          "additionalDocUpload", "additionalDetails"
        ],
      },
    ];
  
    // Print main header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('ISSPRO CR Request Summary', 10, y);
    y += 12;
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
  
    // Loop through each section
    for (const section of sections) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(section.title, 10, y);
      y += 8;
    
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
    
      for (const key of section.keys) {
        try {
          const value = getValueFromElement(key);
          if (value !== null && value !== "") {
            const label = formatKey(key);
            const line = `${label}: ${value}`;
            const splitLine = doc.splitTextToSize(line, 180);
            doc.text(splitLine, 10, y);
            y += splitLine.length * 8;
      
            if (y > 270) {
              doc.addPage();
              y = 10;
            }
          }
        } catch (err) {
          console.error(`Error processing key: ${key}`, err);
        }
      }

      // ✅ INSERT CUSTOM TABLE IN "Sender Output Requirements"
      if (section.title === "Sender Output Requirements") {
        const tableContainer = document.getElementById('generatedResistanceTableContainer');
        if (tableContainer && tableContainer.style.display !== 'none') {
          const rows = tableContainer.querySelectorAll('tbody tr');
          if (rows.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text('Custom Resistance Table', 10, y);
            y += 10;
    
            doc.setFont("helvetica", "normal");
    
            for (const row of rows) {
              const levelInput = row.querySelector('input[name^="level_"]');
              const ohmsInput = row.querySelector('input[name^="ohms_"]');
    
              const level = levelInput?.value || 'N/A';
              const ohms = ohmsInput?.value || 'N/A';
    
              const line = `Level: ${level}, Ohms: ${ohms}`;
              const splitLine = doc.splitTextToSize(line, 180);
              doc.text(splitLine, 10, y);
              y += splitLine.length * 8;
    
              if (y > 270) {
                doc.addPage();
                y = 10;
              }
            }
          }
        }
      }
    
      y += 8; // Add space after section
      doc.setFont("helvetica", "bold");
    }
  
    // Add footers
    const addFooters = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 200, 290, null, null, 'right');
      }
    };
    addFooters();
  
    const pdfBlob = doc.output("blob");
  
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const filename = `Quote_Request_${pad(now.getHours())}-${pad(now.getMinutes())}_${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()}.pdf`;
  
    const inputs = [
      document.getElementById("uploadDocs"),
      document.getElementById("qualityDocUpload"),
      document.getElementById("modificationDocUpload"),
      document.getElementById("additionalDocUpload")
    ];
  
    const allFiles = [];
    inputs.forEach(input => {
      if (input && input.files) {
        for (const file of input.files) {
          allFiles.push(file);
        }
      }
    });
  
    const zip = new JSZip();
    zip.file(filename, pdfBlob);
    for (const file of allFiles) {
      zip.file(file.name, file);
    }
  
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipName = filename.replace(".pdf", ".zip");
  
    console.log("ZIP file size:", zipBlob.size, "bytes");
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    const MAX_EMAIL_SIZE = 25 * 1024 * 1024;
    if (zipBlob.size > MAX_EMAIL_SIZE) {
      alert(`ZIP file size is too large to email (${(zipBlob.size / 1024 / 1024).toFixed(2)} MB).\n\nPlease contact danielb@isspro.com for assistance on how to share.`);
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("zipFile", zipBlob, zipName); // <-- updated key here
  /*
    try {
      const response = await fetch("https://isspro-cr-generation-backend.onrender.com/upload", { // <-- updated URL here
        method: "POST",
        body: formDataToSend,
      });
  
      if (response.ok) {
        alert("ZIP file downloaded and email sent to ISSPRO! Thank you for contacting ISSPRO! We are reviewing your request and will reach out if we have any questions.");
      } else {
        alert("ZIP downloaded, but failed to send email.");
      }
    } catch (error) {
      console.error("Email error:", error);
      alert("ZIP downloaded, but an error occurred while sending the email.");
    }
    */
  }

  function validateForm() {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let missingFields = [];
    let firstInvalidField = null;
  
    // Validate regular required fields
    requiredFields.forEach(field => {
      field.style.border = '';
  
      if (!field.value.trim()) {
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
        isValid = false;
        missingFields.push(field.name || field.id);
        field.style.border = '2px solid red';
      }
    });
  
    // ✅ Validate checkbox group
    const qualityDocsGroup = document.getElementById('qualityDocsGroup');
    if (qualityDocsGroup) {
      const checkboxes = qualityDocsGroup.querySelectorAll('input[type="checkbox"]');
      const oneChecked = Array.from(checkboxes).some(cb => cb.checked);
  
      if (!oneChecked) {
        isValid = false;
        missingFields.push('Quality Documents');
        if (!firstInvalidField) {
          firstInvalidField = checkboxes[0];
        }
        qualityDocsGroup.style.border = '2px solid red';
      } else {
        qualityDocsGroup.style.border = ''; // reset if valid
      }
    }
  
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
  generatePDFAndZip(formData);
});

  generateSignalTable();
});