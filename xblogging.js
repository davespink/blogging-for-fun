function getVersion() {
  const version = "1.0.0"; return version
}

function showAlert(message, type = "alert-error", duration = 3000) {
  const alertBox = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");

  // Set the message and type
  alertMessage.textContent = message;
  alertBox.className = `alert ${type}`;
  alertBox.style.display = "block";



  // Add a click event listener to the document
  const closeAlertOnClick = (event) => {
    // Check if the click is outside the alert box
    if (!alertBox.contains(event.target)) {
      alertBox.style.display = "none"; // Hide the alert
      document.removeEventListener("click", closeAlertOnClick); // Remove the event listener
    }
  };

  document.addEventListener("click", closeAlertOnClick);

  // Optionally, hide the alert after a duration
  setTimeout(() => {
    alertBox.style.display = "none";
    document.removeEventListener("click", closeAlertOnClick); // Remove the event listener
  }, duration);








}



// doesn't write out posts 
function generateSideMenu() {

  //   if (readOnly) {
  //    const adminElements = document.getElementsByClassName("admin");
  //      Array.from(adminElements).forEach((element) => {
  //       element.style.display = "none";
  //    });
  //     }
  //
  const sideMenu = document.getElementById("side-menu");
  sideMenu.innerHTML = "";

  if (readOnly)
    var posts = postsContent;
  else
    var posts = CRUD.getAllPosts();

  posts.forEach((post) => {
    const menuItem = document.createElement("button");
    menuItem.className = "w3-button w3-block w3-theme-l4";
    menuItem.style.marginBottom = "5px";
    menuItem.style.display = "flex"; // Align image and text horizontally
    menuItem.style.alignItems = "center"; // Center-align image and text

    // Add an image to the button
    const img = document.createElement("img");
    img.src = `images/${post.image}`; // Use the post's image
    img.alt = post.headline;
    img.style.width = "30px"; // Set image size
    img.style.height = "30px";
    img.style.marginRight = "10px"; // Add spacing between image and text

    // Add text to the button
    const text = document.createTextNode(post.headline || "Untitled Post");

    // Append image and text to the button
    menuItem.appendChild(img);
    menuItem.appendChild(text);

    // Add click functionality
    menuItem.onclick = () => {


      const targetPost = document.getElementById(post.key);
      const middleColumn = document.querySelector("#middle-column");


      //  remove this code and replace it with a filter function 

      if (onePost) {
        document.querySelectorAll(".post").forEach((post) => {
          post.style.display = "none";
        });
        // show the one with post.key
        targetPost.style.display = "block";
      }


      if (targetPost && middleColumn) {
        middleColumn.scrollTo({
          top: targetPost.offsetTop - middleColumn.offsetTop,
          behavior: "smooth",
        });
      }

    };

    sideMenu.appendChild(menuItem);
  });
}


// does read more, read less
function togglePost() {
  const thisButton = this;
  const post = thisButton.closest(".post");
  const content = post.querySelector(".content");
  if (content.style.display === "none" || !content.style.display) {
    content.style.display = "block";
    thisButton.textContent = "Read Less";
  } else {
    content.style.display = "none";
    thisButton.textContent = "Read More";
  }
}


// CRUD operations for posts using localStorage

class CRUD {
  static createPost(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error saving post:", e);
    }
  }

  static retrievePost(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error retrieving post:", e);
      return null;
    }
  }

  static updatePost(key, value) {
    this.createPost(key, value);
  }

  static deletePost(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Error deleting post:", e);
    }
  }

  static getAllPosts() {
    const posts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("post-") || true) {
        const post = this.retrievePost(key);
        if (post) posts.push(post);
      }
    }
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static deleteAllPosts() {
    localStorage.clear();
    alert("All posts have been deleted.");






  }
}

// to show the posts on page load on the main page


function newrenderPosts() {
  const postsContainer = document.querySelector('.post-container');
  postsContainer.innerHTML = ''; // Clear existing posts

  if (readOnly)
    var posts = postsContent; // from content.js
  else
    var posts = CRUD.getAllPosts();

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <h3>${post.headline}</h3>
      <p>${post.teaser}</p>
      <div>${post.content}</div>
    `;
    postsContainer.appendChild(postElement);
  });
}

function renderPosts() {
  const postContainer = document.querySelector(".post-container");
  if (!postContainer) {
    console.error("post-container not found");
    return;
  }

  if (readOnly)
    var posts = postsContent; // from content.js
  else
    var posts = CRUD.getAllPosts();

  // would be good to have a filter function here to filter and sort posts

  // write code to filter posts by date and sort them in descending order

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.id = post.key;
    postElement.className = "post";
    postElement.style.cssText = "background-color:beige; padding: 12px; margin-bottom: 10px;";
    postElement.innerHTML = `
      <div class="w3-card-4 post-header" style="width:100%;margin-bottom:20px;border-radius: 5px; ">
        <header class="w3-container w3-light-grey" style="padding:0px;">
          <h3>${post.headline}</h3>
        </header>
        <div class="w3-container">
          <img src="images/${post.image}" alt="Image for ${post.headline}" class="w3-left w3-margin-right" style="max-width:150px;max-height:150px;margin-bottom:10px">
          <p>${post.teaser}</p><br>
          <div class="w3-right w3-margin-top">
        
          </div>
        </div>
        <div style="height:40px;style="background-color: pink;">


    <button class="admin" style="margin-left:20px" onclick="editPost('${post.key}')">Edit</button>
            <button class="admin" onclick="deletePost('${post.key}')">Delete</button>
          <button style="float:right;margin-top: 0px;margin-right:10px" 
          onclick="togglePost.call(this)" aria-label="Toggle post content">Read More</button>
        </div>
      </div>
      <div class="content" style="display:none">${post.content}</div>
    `;
    postContainer.appendChild(postElement);
  });

  //      alert(posts.length + " posts loaded.");


  showAlert(posts.length + " posts loaded", "alert-success", 5000); // Closes after 5 seconds


  generateSideMenu();
}


function setupPostForm() {

  const formContainer = document.querySelector(".input-form");
  if (formContainer) {
    formContainer.style.display = "block"; // Show the form


    // Scroll the form into view
    formContainer.scrollIntoView({
      behavior: "smooth", // Smooth scrolling
      block: "start", // Align to the top of the block
    });

  }

  // Reset the form fields for creating a new post
  const form = document.getElementById("new-post-form");
  if (!form.dataset.editing) {
    form.reset(); // Reset the form only if not editing
    document.getElementById("post-key").value = Date.now(); // Generate a new unique key


    const postType = document.getElementById("editType");
    postType.innerHTML = "Create Post";


  }


  form.onsubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!"); // Debugging statement
    const key = document.getElementById("post-key").value;
    const error = document.getElementById("post-key-error");

    // Check for duplicate keys only when creating a new post
    if (!form.dataset.editing && CRUD.retrievePost(key)) {
      error.style.display = "block";
      return;
    }
    error.style.display = "none";

    const post = {
      key: document.getElementById("post-key").value,
      headline: document.getElementById("post-headlinex").value,
      teaser: document.getElementById("post-teaser").value,
      content: document.getElementById("post-content").value,


      image: document.getElementById("post-imagex").files[0]
        ? document.getElementById("post-imagex").files[0].name
        : document.getElementById("current-image").textContent.replace("Current Image: ", ""),





      date: document.getElementById("post-date").value || new Date().toISOString().split("T")[0],
    };

    if (form.dataset.editing) {
      // Update the existing post
      CRUD.updatePost(post.key, post);
    } else {
      // Create a new post
      if (post.key == "")
        alert("Key is empty. Please enter a valid key.");
      else {
        alert("new post");
        CRUD.createPost(post.key, post);
      }
    }

    renderPosts(); // Re-render the posts
    form.reset(); // Reset the form
    form.dataset.editing = ""; // Clear editing mode
    formContainer.style.display = "none"; // Hide the form
  };
}


function editPost(postKey) {



  const post = CRUD.retrievePost(postKey); // Retrieve the post data
  if (post) {
    const formContainer = document.querySelector(".input-form");
    if (formContainer) {
      formContainer.style.display = "block"; // Show the form

      // Scroll the form into view
      formContainer.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "start", // Align to the top of the block
      });

      const editType = document.getElementById("editType");
      editType.innerHTML = "Edit Post"; // Change the form title to "Edit Post"



    }

    // Populate the form fields with the post's data
    document.getElementById("post-key").value = post.key;
    document.getElementById("post-headlinex").value = post.headline;
    document.getElementById("post-teaser").value = post.teaser;
    document.getElementById("post-content").value = post.content;
    document.getElementById("post-date").value = post.date || "";

    // Display the current image filename
    const currentImageElement = document.getElementById("current-image");
    currentImageElement.textContent = `Current Image: ${post.image || "None"}`;

    // Set the form to edit mode
    const form = document.getElementById("new-post-form");
    form.dataset.editing = "true";

    setupPostForm();
  }
}






function deletePost(postKey) {
  if (confirm("Delete this post?")) {
    CRUD.deletePost(postKey);
    renderPosts();
  }
}


function hideForm() {
  const formContainer = document.querySelector(".input-form");
  if (formContainer) {
    formContainer.style.display = "none"; // Hide the form
  }
}



function downloadPosts() {
  const posts = CRUD.getAllPosts();
  const data = JSON.stringify(posts, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "blog-posts.json";
  a.click();
  URL.revokeObjectURL(url);
}

function uploadPosts() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const posts = JSON.parse(event.target.result);
          posts.forEach((post) => {
            if (!CRUD.retrievePost(post.key)) {
              CRUD.createPost(post.key, post);
            }
          });
          renderPosts();
          alert("Posts uploaded successfully!");
        } catch (e) {
          console.error("Error uploading posts:", e);
          alert("Failed to upload posts. Please check the JSON format.");
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("new-post-form");

});




