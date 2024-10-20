const { name } = require("ejs");

const buttonPassword = document.getElementById("show-password")
const passwordInput = document.getElementById('account_password')

buttonPassword.addEventListener('click', (e) => {
    e.preventDefault();
    const type = passwordInput.getAttribute("type");
    //console.log("click on the button");
    if (type === "password") {
        passwordInput.setAttribute("type", "text")
        buttonPassword.textContent = "Hide Password";
    } else {
        passwordInput.setAttribute("type", "password");
        buttonPassword.textContent = "Show Password";
    }
})
