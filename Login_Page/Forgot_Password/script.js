document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/login", { // Ensure this URL matches your Flask route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            if (data.success) {
                // Redirect or perform actions upon successful login
            }
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred!");
        });
});

// Handle Forgot Password
document.getElementById("forgot-password").addEventListener("click", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;

    if (!email) {
        alert("Please enter your email address!");
        return;
    }

    fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred!");
        });
});
