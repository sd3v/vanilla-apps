# Batch Image Processor

## Overview
Batch Image Processor is a web-based application that allows users to perform batch operations on images directly in the browser. The app supports various image transformations such as resizing, flipping, mirroring, grayscale, and color inversion. Users can preview processed images, revert changes, and download all final images with filenames preserved.

---

## Features
1. **Drag & Drop Support**:
   - Easily drag and drop images into the application.
   - Alternatively, use the file input to select multiple images.

2. **Batch Processing**:
   - Apply operations to all selected images at once.

3. **Supported Operations**:
   - Resize (custom width and height).
   - Invert Colors.
   - Grayscale.
   - Flip Vertically.
   - Mirror Horizontally.

4. **Preview and Revert**:
   - View processed images in a small preview.
   - Revert to the original processed state or reset all changes to the original files.

5. **Download Processed Images**:
   - Download all processed images with filenames appended by `_batched`.

---

## How to Use
1. **Upload Images**:
   - Drag and drop images into the drop zone or use the "Choose Files" button.

2. **Select Operations**:
   - Use the checkboxes to select one or more transformations.
   - If resizing, specify width and height in pixels.

3. **Process Images**:
   - Click the **"Process Images"** button to apply the selected transformations.

4. **Preview and Revert**:
   - View processed images in the preview area.
   - Use the **"Revert Changes"** button to go back to the last processed state.
   - Use the **"Reset All Changes"** button to reset all images to their original state.

5. **Download Images**:
   - Click **"Download All Processed Images"** to save all final images with filenames in the format `<original_filename>_batched.png`.

---

## Technologies Used
- **HTML**: For the structure of the app.
- **CSS**: For styling and responsiveness.
- **JavaScript**: For image processing and interactivity.

---

## File Naming Convention
Processed files are downloaded with their original filenames appended by `_batched`. 
For example:
- Original: `photo.jpg` → Processed: `photo_batched.png`.
- Original: `holiday_picture.jpeg` → Processed: `holiday_picture_batched.png`.

---

## Development
To host the application:
1. Clone the repository.
2. Open the `index.html` file in any modern browser.
3. Enjoy batch image processing!

---

## License
This project is open-source and free to use.
"""