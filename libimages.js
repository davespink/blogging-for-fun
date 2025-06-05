// lib.js

function handleFileSelect(file, callback) {

  if (file) {
    processFile(file, callback);
  }
  
}

function saveDom() {
  // Save the current body HTML to localStorage
  localStorage.setItem('savedDom', theDiv.innerHTML);
  // alert('DOM saved!');
};

// Restore DOM button
function restoreDom() {
  // Restore the saved HTML from localStorage
  const saved = localStorage.getItem('savedDom');
  if (saved) {
    theDiv.innerHTML = saved;
  }
}


function processFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const maxWidth = 200;
      const scale = Math.min(maxWidth / img.width, 1);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

      //    if (callback) callback(dataUrl); // Call the callback with the Data URL

      if (callback)
        callback({
          url: e.target.result,
          name: file.name
        });

    };
    img.src = e.target.result; // causes the onload
  };
  reader.readAsDataURL(file);

  let x = 1;

}



