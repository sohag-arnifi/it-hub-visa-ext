const baseUrl =
  window.location.origin === "http://localhost:5000"
    ? "http://localhost:5000"
    : "https://it-hub.programmerhub.xyz";

console.log(baseUrl);

document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is logged in
  chrome.storage.local.get(["loggedIn"], (result) => {
    if (result.loggedIn) {
      showLoggedInState();
    } else {
      showLoggedOutState();
    }
  });

  // Get the form and attach the submit event listener
  const form = document.getElementById("login-form");
  form.addEventListener("submit", login);

  // Get the logout button and attach the click event listener
  const logoutBtn = document.getElementById("logout");
  logoutBtn.addEventListener("click", logout);
});

function login(event) {
  event.preventDefault();

  // Get form data
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginBtn = document.getElementById("login");

  // Show loading state for login button
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  loginBtn.style.cursor = "not-allowed";
  loginBtn.style.opacity = 0.5;

  fetch(`${"http://localhost:5000"}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.success) {
        chrome.storage.local.set(
          {
            loggedIn: true,
            logData: data,
          },
          () => {
            showLoggedInState();
          }
        );
      } else {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
        loginBtn.style.cursor = "pointer";
        loginBtn.style.opacity = 1;
        document.getElementById("error-message").style.display = "block";
        const message = data?.message || "An error occurred during login.";
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = message;
        document.getElementById("error-message").style.display = "block";
      }
    })
    .catch((error) => {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      loginBtn.style.cursor = "pointer";
      loginBtn.style.opacity = 1;
      const message = error?.message || "An error occurred during login.";
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = message;
      document.getElementById("error-message").style.display = "block";
    });
}

function logout() {
  chrome.storage.local.clear(() => {
    showLoggedOutState(); // Update UI to reflect the logged-out state
    window.close(); // Optionally close the current window (if needed)
  });
}

function showLoggedInState() {
  // Hide login form, show logout button
  document.getElementById("login-form").style.display = "none";
  document.getElementById("logout").style.display = "block";
  document.getElementById("loading").style.display = "none";
  document.getElementById("error-message").style.display = "none";
}

function showLoggedOutState() {
  // Show login form, hide logout button
  document.getElementById("login-form").style.display = "block";
  document.getElementById("logout").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("error-message").style.display = "none";
}
