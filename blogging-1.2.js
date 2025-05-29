function getVersion() {
    const version = "1.0.2"; return version;
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
    return;

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


        const template = document.getElementById("template-post");
        const newPost = template.content.cloneNode(true);
        newPost.querySelector(".template-image").setAttribute("src", post.image);
        // ...fill in other fields...
        postContainer.appendChild(newPost);


        //   newPost.id = post.key; // Set the ID of the post for easy access later

        const menuItem = document.createElement("button");
        menuItem.className = "w3-button w3-block w3-theme-l4";
        menuItem.style.marginBottom = "5px";
        menuItem.style.display = "flex"; // Align image and text horizontally
        menuItem.style.alignItems = "center"; // Center-align image and text

        // Add an image to the button
        const img = document.createElement("img");
        const imgSrc = post.image && post.image.startsWith('data:image/')
            ? post.image
            : `images/${post.image || 'default.jpg'}`;
        img.src = imgSrc; // Use the post's image
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
    const content = post.querySelector(".post-content");
    if (content.style.display === "none" || !content.style.display) {
        content.style.display = "block";
        thisButton.textContent = "Read Less";
    } else {
        content.style.display = "none";
        thisButton.textContent = "Read More";
    }
}


// CRUD operations for posts using localStorage

// create two versions of CRUD, one for localStorage and one for Cloudflare key-value storage

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

// cant do this !newCrud = new CRUD();


// to show the posts on page load on the main page


 function renderPosts() {
    const postContainer = document.querySelector(".post-container");
    if (!postContainer) {
        console.error("post-container not found");
        return;
    }

    if (readOnly)
        posts = postsContent; // from content.js
    else
        posts = CRUD.getAllPosts();

    // would be good to have a filter function here to filter and sort posts

    // write code to filter posts by date and sort them in descending order

    posts.forEach((post) => {


        let templatePost = document.getElementById("template-post");

        const postContainer = document.querySelector(".post-container");
        const newPost = templatePost.content.cloneNode(true);

        const editBtn = newPost.querySelector(".edit-btn");
        if (editBtn) {
            editBtn.onclick = () => editPost(post.key);
        }
        const deleteBtn = newPost.querySelector(".delete-btn");
        if (deleteBtn) {
            deleteBtn.onclick = () => deletePost(post.key);
        }

        newPost.querySelector(".post-headline").textContent = post.headline;
        newPost.querySelector(".post").id = post.key;

        let imageUrl = post.image;
        if (imageUrl && !imageUrl.startsWith("data:image/")) {
            imageUrl = "./images/" + imageUrl;
        }
        newPost.querySelector(".template-image").setAttribute("src", imageUrl);

        newPost.querySelector(".template-teaser").textContent = post.teaser;
        newPost.querySelector(".post-content").innerHTML = post.content;

        // Now append to the DOM
        postContainer.appendChild(newPost);

        // add button to sidebar


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


        sidebar.appendChild(sidebarBtn);


    });

    //      alert(posts.length + " posts loaded.");


    showAlert(posts.length + " posts loaded", "alert-success", 5000); // Closes after 5 seconds


    // generateSideMenu();
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
            imageName: "",
            image: "",

            date: document.getElementById("post-date").value || new Date().toISOString().split("T")[0],
        };

        post.image = preview.getAttribute('src') || "default.jpg"; // Set a default image if none is provided
        post.imageName = document.getElementById("current-image").textContent;

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

                        console.log("Uploading post:", post);
                        if (!CRUD.retrievePost(post.key)) {
                            CRUD.createPost(post.key, post);
                        }
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




