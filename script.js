async function loadColors() {
  const response = await fetch("colors.json");
  const colors = await response.json();

  const colorMap = {};
  colors.forEach((c, i) => colorMap[i] = c);

  const comboMap = {};
  colors.forEach((c, i) => {
    c.combinations.forEach(comboId => {
      if (!comboMap[comboId]) comboMap[comboId] = new Set();
      comboMap[comboId].add(i);
    });
  });

  const comboGrid = document.getElementById("comboGrid");
  const modal = document.getElementById("colorModal");
  const closeModal = document.getElementById("closeModal");
  const modalColors = document.getElementById("modalColors");
  const modalTitle = modal.querySelector("h2");

  Object.entries(comboMap).forEach(([comboId, indices]) => {
    const plate = document.createElement("div");
    plate.className = "plate";

    const swatchRow = document.createElement("div");
    swatchRow.className = "swatch-row";

    indices.forEach(idx => {
      const col = colorMap[idx];
      if (col) {
        const sw = document.createElement("div");
        sw.className = "swatch";
        sw.style.backgroundColor = col.hex;
        sw.title = `${col.name} (${col.hex})`;
        swatchRow.appendChild(sw);
      }
    });

    const info = document.createElement("div");
    info.className = "plate-info";
    info.innerHTML = `<span><strong>Combination ${comboId}</strong></span> 
      ${Array.from(indices).map(i => colorMap[i].name).join(", ")}`;

    plate.appendChild(swatchRow);
    plate.appendChild(info);

    plate.addEventListener("click", () => {
      modalTitle.innerText = `Combination ${comboId}`;
      modalColors.innerHTML = "";
      indices.forEach(idx => {
        const col = colorMap[idx];
        if (col) {
          const colorDiv = document.createElement("div");
          colorDiv.className = "modal-color";
          colorDiv.innerHTML = `
            <div class="modal-swatch" style="background-color: ${col.hex}"></div>
            <div>${col.name}</div>
            <div class="hex-code">${col.hex}</div>
          `;
          
          colorDiv.addEventListener("click", () => {
            navigator.clipboard.writeText(col.hex);
            const hexCodeDiv = colorDiv.querySelector(".hex-code");
            const originalText = hexCodeDiv.innerText;
            hexCodeDiv.innerText = "Copied!";
            setTimeout(() => {
              hexCodeDiv.innerText = originalText;
            }, 1000);
          });

          modalColors.appendChild(colorDiv);
        }
      });
      modal.classList.add("active");
    });

    comboGrid.appendChild(plate);
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

loadColors();