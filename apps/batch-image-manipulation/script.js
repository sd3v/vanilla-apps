document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const resizeCheckbox = document.getElementById("resizeCheckbox");
    const invertCheckbox = document.getElementById("invertCheckbox");
    const grayscaleCheckbox = document.getElementById("grayscaleCheckbox");
    const flipCheckbox = document.getElementById("flipCheckbox");
    const mirrorCheckbox = document.getElementById("mirrorCheckbox");
    const resizeInputs = document.getElementById("resizeInputs");
    const resizeWidth = document.getElementById("resizeWidth");
    const resizeHeight = document.getElementById("resizeHeight");
    const processButton = document.getElementById("processButton");
    const revertButton = document.getElementById("revertButton");
    const resetButton = document.getElementById("resetButton");
    const previewContainer = document.getElementById("previewContainer");
    const downloadButton = document.getElementById("downloadButton");

    let selectedFiles = [];
    // Store original images
    let originalImages = []; 
    // Store the final state of images
    let finalImages = [];

    // Show/hide resize inputs based on checkbox
    resizeCheckbox.addEventListener("change", () => {
        resizeInputs.style.display = resizeCheckbox.checked ? "block" : "none";
    });

    // Handle file selection via drag-and-drop
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "blue";
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "#ccc";
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#ccc";
        handleFiles(e.dataTransfer.files);
    });

    // Handle file selection via input
    fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
    });

    processButton.addEventListener("click", async () => {
        if (selectedFiles.length === 0) {
            alert("Please select images first.");
            return;
        }
    
        const actions = getSelectedActions();
        if (actions.length === 0) {
            alert("Please select at least one action.");
            return;
        }
    
        const processedImages = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const img = await loadImage(selectedFiles[i]);
            let canvas = createCanvasFromImage(img);
    
            for (const action of actions) {
                switch (action) {
                    case "resize":
                        const width = parseInt(resizeWidth.value, 10) || canvas.width;
                        const height = parseInt(resizeHeight.value, 10) || canvas.height;
                        canvas = resizeImage(canvas, width, height);
                        break;
                    case "invert":
                        canvas = applyFilter(canvas, "invert");
                        break;
                    case "grayscale":
                        canvas = applyFilter(canvas, "grayscale");
                        break;
                    case "flip":
                        canvas = flipImage(canvas);
                        break;
                    case "mirror":
                        canvas = mirrorImage(canvas);
                        break;
                    default:
                        break;
                }
            }
    
            processedImages.push(canvas);
        }
    
        // Update preview and final images
        previewContainer.innerHTML = "";
        finalImages = []; // Reset final images
        processedImages.forEach((canvas) => {
            const wrapper = document.createElement("div");
            // Apply the fixed preview size
            wrapper.className = "preview-wrapper"; 
            wrapper.appendChild(canvas);
            previewContainer.appendChild(wrapper);
            // Save processed canvas into finalImages
            finalImages.push(canvas);
        });
    
        // Show buttons for download and revert
        downloadButton.style.display = "block";
        revertButton.style.display = "block";
        resetButton.style.display = "block";
    });

    // Revert images to the state before the last process
    revertButton.addEventListener("click", () => {
        previewContainer.innerHTML = "";
        finalImages.forEach((canvas) => {
            previewContainer.appendChild(canvas);
        });
    });

    // Reset all images to their original state
    resetButton.addEventListener("click", () => {
        previewContainer.innerHTML = "";
        finalImages = []; // Clear final images
        originalImages.forEach((imgSrc) => {
            const img = document.createElement("img");
            img.src = imgSrc;
            previewContainer.appendChild(img);
        });
        downloadButton.style.display = "none";
        revertButton.style.display = "none";
        resetButton.style.display = "none";
    });

    // Add event listener to the download button
    downloadButton.addEventListener("click", () => {
        if (finalImages.length === 0) {
            alert("No images to download. Please process images first.");
            return;
        }
    
        finalImages.forEach((canvas, index) => {
            const originalFileName = selectedFiles[index].name.split('.').slice(0, -1).join('.');
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
             // Append _batched to original filename
            link.download = `${originalFileName}_batched.png`;
            link.click();
        });
    });
    


    // Helper to handle selected files
    function handleFiles(files) {
        selectedFiles = Array.from(files);
        previewContainer.innerHTML = "";
        // Reset original images
        originalImages = [];
        // Reset final images
        finalImages = []; 

        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement("img");
                img.src = event.target.result;
                // Store original image
                originalImages.push(event.target.result);
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    // Helper to get selected actions
    function getSelectedActions() {
        const actions = [];
        if (resizeCheckbox.checked) actions.push("resize");
        if (invertCheckbox.checked) actions.push("invert");
        if (grayscaleCheckbox.checked) actions.push("grayscale");
        if (flipCheckbox.checked) actions.push("flip");
        if (mirrorCheckbox.checked) actions.push("mirror");
        return actions;
    }

    // Helper to load an image
    function loadImage(file) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = URL.createObjectURL(file);
        });
    }

    // Create canvas from image
    function createCanvasFromImage(img) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        return canvas;
    }

    // Resize image
    function resizeImage(canvas, width, height) {
        const resizedCanvas = document.createElement("canvas");
        const ctx = resizedCanvas.getContext("2d");
        resizedCanvas.width = width;
        resizedCanvas.height = height;
        ctx.drawImage(canvas, 0, 0, width, height);
        return resizedCanvas;
    }

    // Apply filter (invert or grayscale)
    function applyFilter(canvas, filter) {
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (filter === "invert") {
                // Red
                data[i] = 255 - data[i];
                 // Green
                data[i + 1] = 255 - data[i + 1];
                 // Blue
                data[i + 2] = 255 - data[i + 2];
            } else if (filter === "grayscale") {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    // Flip image vertically
    function flipImage(canvas) {
        const flippedCanvas = document.createElement("canvas");
        const ctx = flippedCanvas.getContext("2d");
        flippedCanvas.width = canvas.width;
        flippedCanvas.height = canvas.height;
        ctx.scale(1, -1);
        ctx.drawImage(canvas, 0, -canvas.height);
        return flippedCanvas;
    }

    // Mirror image horizontally
    function mirrorImage(canvas) {
        const mirroredCanvas = document.createElement("canvas");
        const ctx = mirroredCanvas.getContext("2d");
        mirroredCanvas.width = canvas.width;
        mirroredCanvas.height = canvas.height;
        ctx.scale(-1, 1);
        ctx.drawImage(canvas, -canvas.width, 0);
        return mirroredCanvas;
    }
});
