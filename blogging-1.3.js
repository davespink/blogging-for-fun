function gid(id) {
    return document.getElementById(id);
}
function qs(q) {
    return document.querySelector(q);
}
function qsa(q) {
    return document.querySelectorAll(q);
}
function hid(el) {
    el.style.display = 'none';
}
function vid(el) {
    el.style.display = 'initial';
}
function tvid(el) {
    if (el.style.display == 'initial')
        hid(el)
    else vid(el);
}
function viz(el) {
    if (el.style.display == 'initial')
        return true; else return false;
}
function isa(el, c) {
    if (el == undefined || el == null || el == document)
        return false;
    if (el.classList.contains(c))
        return true; else return false;
}



function getVersion() {
    const version = "1.3 2 June 25 "; return version;
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



function scrollToPost(postKey, onePost = false) {

    const targetPost = document.getElementById(postKey);
    const middleColumn = document.querySelector("#middle-column");

    if (targetPost && middleColumn) {

        window.scrollTo({ top: 0, behavior: "smooth" });
        middleColumn.scrollTo({
            top: targetPost.offsetTop - middleColumn.offsetTop,
            behavior: "smooth",
        });
    } else {
        // Handle case where post or middleColumn is not found
        //   alert("Post or middle column not found");
        window.scrollTo({ top: 0, behavior: "smooth" });
        middleColumn.scrollTo({
            top: 0, // Scroll to the top of the middle column
            behavior: "smooth",
        });



    }
}

// does read more, read less
function togglePost() {
    const thisButton = this;
    const post = thisButton.closest(".post");
    const content = post.querySelector(".post-content");
    if (content.style.display === "none" || !content.style.display) {
        content.style.display = "block";
        thisButton.textContent = "Read Less";
    } else {
        content.style.display = "none";
        thisButton.textContent = "Read More";
    }
}


function readLess() {


    const thisButton = this;
    const post = thisButton.closest(".post");

    let b = post.querySelector(".readmore-btn");

    b.click(); // Trigger the read more button click

}




// crud operations for posts using localStorage



class LocalCrud {
    createPost(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {

            alert("Error saving post: " + e.message);
            localStorage.clear();
        }
    }

    retrievePost(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Error retrieving post:", e);
            return null;
        }
    }

    updatePost(key, value) {
        this.createPost(key, value);
    }

    deletePost(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error("Error deleting post:", e);
        }
    }
    getAllPosts() {
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

    deleteAllPosts() {
        localStorage.clear();
        alert("All posts have been deleted.");


    }
}


class RemoteCrud {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;

    }
    async createPost(key, value) {
        try {

            const response = await fetch(`${this.baseUrl}/create?key=${encodeURIComponent(key)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            });
            return await response.text();
        } catch (error) {
            console.error('Error creating:', error);
            throw error;
        }
    }

    async retrievePost(key) {

        try {
            const response = await fetch(`${this.baseUrl}/retrieve?key=${encodeURIComponent(key)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error('Error retrieving:', error);
            throw error;
        }
    }

    async updatePost(key, value) {


        try {
            const response = await fetch(`${this.baseUrl}/update?key=${encodeURIComponent(key)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            });
            return await response.text();
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }

    async deletePost(key) {

        try {
            const response = await fetch(`${this.baseUrl}/delete?key=${encodeURIComponent(key)}`, {
                method: 'GET',
            });
            return await response.text();
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }

    async getAllPosts() {

        let x = await this.listAll();

        const remotePosts = Array.from(x);
        const posts = [];

        remotePosts.forEach(post => {
            let fixPost;
            fixPost = JSON.parse(post.value);
            posts.push(fixPost);
        });

        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }


    async listAll() {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            return await response.json();

        } catch (error) {
            console.error('Error listing all:', error);
            throw error;
        }
    }

    async deleteAllPosts() {
        try {
            const response = await fetch(`${this.baseUrl}/delete-all`, {
                method: 'POST',
            });
            return await response.text();
        } catch (error) {
            console.error('Error deleting all:', error);
            throw error;
        }
    }
}

const useRemote = false; // Set to true to use RemoteCrud, false for LocalCrud

let crud;
if (useRemote) {
   crud = new RemoteCrud("https://new-crud.henrytatum.workers.dev"); // Cloudflare Workers URL
// crud = new RemoteCrud("http://127.0.0.1:8787"); // Local server development URL
} else {
    crud = new LocalCrud(); // Local storage
}





function deleteAllPosts() {
    crud.deleteAllPosts();
}

async function renderPosts() {
    const postContainer = document.querySelector(".post-container");
    if (!postContainer) {
        console.error("post-container not found");
        return;
    }


    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = "Loading...";


    if (readOnly)
        posts = postsContent; // from content.js
    else
        posts = await crud.getAllPosts();

    // would be good to have a filter function here to filter and sort posts

    // write code to filter posts by date and sort them in descending order

    posts.forEach((post) => {


        let templatePost = document.getElementById("template-post");

        const postContainer = document.querySelector(".post-container");
        //   const allPosts = postContainer.querySelector(".all-posts");

        const newPost = templatePost.content.cloneNode(true);

        const editBtn = newPost.querySelector(".edit-btn");
        if (editBtn) {
            editBtn.onclick = () => editPost(post.key);
        }
        const deleteBtn = newPost.querySelector(".delete-btn");
        if (deleteBtn) {
            deleteBtn.onclick = () => deletePost(post.key);
        }

        //   if (!isAdmin) {
        //        editBtn.style.display = "none"; // Hide edit button for non-admin users
        //      deleteBtn.style.display = "none"; // Hide delete button for non-admin users
        //   }

        newPost.querySelector(".post-headline").textContent = post.headline;
        newPost.querySelector(".post").id = post.key;

        let imageUrl = post.image;
        if (imageUrl && !imageUrl.startsWith("data:image/")) {
            imageUrl = "./images/" + imageUrl;
        }
        newPost.querySelector(".template-image").setAttribute("src", imageUrl);

        newPost.querySelector(".template-teaser").textContent = post.teaser;

        theHTML = `<BUTTON onclick="readLess.call(this)" style="float:right">Read Less</BUTTON>`;


        newPost.querySelector(".post-content").innerHTML = post.content + theHTML;


        // Now append to the DOM
        gid("allPosts").appendChild(newPost);

        // Sidebar stuff
        // add button to sidebar
        // Check if the sidebar exists

        const sidebar = document.getElementById("side-menu");
        const sidebarTemplate = document.getElementById("sidebar-item-template");
        const sidebarBtn = sidebarTemplate.content.cloneNode(true);

        // Fill in sidebar button fields
        const img = sidebarBtn.querySelector(".sidebar-img");
        img.src = post.image && post.image.startsWith('data:image/')
            ? post.image
            : `images/${post.image || 'default.jpg'}`;
        img.alt = post.headline;

        sidebarBtn.querySelector(".sidebar-title").textContent = post.headline || "Untitled Post";

        // Add click handler
        //  sidebarBtn.querySelector("button").onclick = () => {
        // Your sidebar click logic here
        //    };



        // Add click functionality
        sidebarBtn.querySelector("button").onclick = () => {

            return scrollToPost(post.key, onePost);


            const targetPost = document.getElementById(post.key);
            const middleColumn = document.querySelector("#middle-column");



            if (onePost) {
                document.querySelectorAll(".post").forEach((post) => {
                    post.style.display = "none";
                });
                // show the one with post.key
                targetPost.style.display = "block";
            }


            if (targetPost && middleColumn) {

                window.scrollTo({ top: 0, behavior: "smooth" });
                middleColumn.scrollTo({
                    top: targetPost.offsetTop - middleColumn.offsetTop,
                    behavior: "smooth",
                });

            }

        };


        sidebar.appendChild(sidebarBtn);


    });

    //      alert(posts.length + " posts loaded.");


    if (alertBox && alertMessage) {
        alertBox.style.display = "none";
        alertMessage.textContent = "";
    }

    showAlert(posts.length + " posts loaded", "alert-success", 5000); // Closes after 5 seconds

    // Parse slug from query string
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const isAdmin = params.get('admin') === 'true';

    if (!isAdmin) {

        // Hide edit and delete buttons for non-admin users
        document.querySelectorAll(".edit-btn, .delete-btn").forEach(btn => {
            btn.style.display = "none";
        });

        document.querySelectorAll(".admin").forEach(element => {
            element.style.display = "none";
        });
    }



    if (slug && Array.isArray(posts)) {
        const post = posts.find(p => p.slug === slug);
        if (post) {
            scrollToPost(post.key);
        }
    }
}


function setupPostForm(isNewPost) {

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
    if (isNewPost) {
        form.reset(); // Reset the form only if not editing
        document.getElementById("post-key").value = Date.now(); // Generate a new unique key
        preview.setAttribute('src', ''); // Set default image
        const postType = document.getElementById("editType");
        postType.innerHTML = "Create Post";


    }


    form.onsubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted!"); // Debugging statement
        const key = document.getElementById("post-key").value;
        const error = document.getElementById("post-key-error");

        // Check for duplicate keys only when creating a new post
        //     if (!form.dataset.editing && crud.retrievePost(key)) {
        //        error.style.display = "block";
        //       return;
        //   }
        error.style.display = "none";

        const post = {
            key: document.getElementById("post-key").value,
            headline: document.getElementById("post-headlinex").value,
            slug: document.getElementById("post-slug").value,
            teaser: document.getElementById("post-teaser").value,
            content: document.getElementById("post-content").value,
            imageName: "",
            image: "",

            date: document.getElementById("post-date").value || new Date().toISOString().split("T")[0],
        };

        post.image = preview.getAttribute('src') || "default.jpg"; // Set a default image if none is provided
        post.imageName = document.getElementById("current-image").textContent;

        if (form.dataset.editing) {
            // Update the existing post
            await crud.updatePost(post.key, post);
        } else {
            // Create a new post
            if (post.key == "")
                alert("Key is empty. Please enter a valid key.");
            else {
                alert("new post");
                await crud.createPost(post.key, post);
            }
        }

        renderPosts(); // Re-render the posts
        form.reset(); // Reset the form
        form.dataset.editing = ""; // Clear editing mode
        formContainer.style.display = "none"; // Hide the form
    };
}


async function editPost(postKey) {

    const post = await crud.retrievePost(postKey); // Retrieve the post data
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
        document.getElementById("post-slug").value = post.slug;
        document.getElementById("post-teaser").value = post.teaser;
        document.getElementById("post-content").value = post.content;
        document.getElementById("preview").src = post.image;
        document.getElementById("current-image").textContent = post.imageName;
        document.getElementById("post-date").value = post.date || "";

        // Display the current image filename
        const currentImageElement = document.getElementById("current-image");
        //currentImageElement.textContent = `Current Image: ${post.image || "None"}`;

        // Set the form to edit mode
        const form = document.getElementById("new-post-form");
        form.dataset.editing = "true";

        setupPostForm();
    }
}






function deletePost(postKey) {
    if (confirm("Delete this post?")) {
        crud.deletePost(postKey);
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
    const posts = crud.getAllPosts();
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

                        console.log("Uploading post:", post);
                        //  if (!crud.retrievePost(post.key)) {
                        crud.createPost(post.key, post);
                        //  }
                    });
                    renderPosts();
                    console.log("Posts uploaded successfully:");
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

// Add this function to your blogging-1.0.js

function filterSidebarByHashtag(tag) {
    // Hide all sidebar buttons
    document.querySelectorAll("#side-menu button").forEach(btn => {
        btn.style.display = "none";
    });

    // Show only buttons whose text (headline) matches posts with the hashtag
    posts.forEach(post => {
        const content = [post.headline, post.teaser, post.content].join(' ');
        const hashtags = extractHashtags(content);
        if (hashtags.includes(tag)) {
            // Find the sidebar button for this post (by headline text)
            document.querySelectorAll("#side-menu button").forEach(btn => {
                if (btn.textContent.trim() === (post.headline || "Untitled Post")) {
                    btn.style.display = "flex";
                }
            });
        }
    });
}

// To restore all sidebar buttons (show all)
function showAllSidebarButtons() {
    document.querySelectorAll("#side-menu button").forEach(btn => {
        btn.style.display = "flex";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-post-form");

    document.getElementById("preview").addEventListener("change", function () {

        const fileName = this.files[0] ? this.files[0].name : "None";
        document.getElementById("current-image").textContent = `Current Image: ${fileName}`;
    });
});


// lib.js ---- this is the image stuff
 

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

