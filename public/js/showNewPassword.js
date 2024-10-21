const buttonPassword = document.getElementById("showPassword");
const passwordInput = document.getElementById("account_password");

buttonPassword.addEventListener('click', () => {
    // e.preventDefault();
    const type = passwordInput.getAttribute("type");
    //console.log("click on the button");
    if (type === "password") {
        //passwordInput.removeAttribute("type");
        passwordInput.setAttribute("type", "text");
        buttonPassword.textContent = "Hide Password";
        //console.log('yep')
    } else {
        //passwordInput.removeAttribute("type");
        passwordInput.setAttribute("type", "password");
        buttonPassword.textContent = "Show Password";
    }
});