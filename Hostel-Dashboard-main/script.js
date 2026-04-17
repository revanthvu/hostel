let generatedOTP = null;
let selectedRoleForOTP = null;

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("login-form");
  const roleSelect = document.getElementById("role");
  const forgotPassword = document.getElementById("forgot-password");
  const forgotPasswordMessage = document.getElementById("forgot-password-message");
  const roleMessage = document.getElementById("role-message");
  const trafficCounter = document.getElementById("traffic-counter");

  const credentials = {
    student: {
      password: "studentPass123",
      usernames: ["student1", "student2"],
    },
    staff: {
      password: "staffPass123",
      usernames: ["staff1", "staff2"],
    },
    warden: {
      password: "wardenPass123",
      usernames: ["warden1", "warden2"],
    },
    admin: {
      password: "adminPass123",
      usernames: ["admin1", "admin2"],
    },
    parent: {
      password: "parentPass123",
      usernames: ["parent1", "parent2"],
    },
  };

  // Traffic counter
  let trafficCount = parseInt(localStorage.getItem("trafficCount")) || 0;
  trafficCount++;
  localStorage.setItem("trafficCount", trafficCount);
  trafficCounter.textContent = `Total Traffic: ${trafficCount}`;

  // LOGIN SUBMIT
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const role = roleSelect.value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!role || !username || !password) {
      roleMessage.textContent =
        "Please select your role, enter username and password";
      return;
    }

    const roleCredentials = credentials[role];

    // ✅ VALIDATE CREDENTIALS FIRST
    if (
      roleCredentials &&
      password === roleCredentials.password &&
      roleCredentials.usernames.includes(username)
    ) {
      selectedRoleForOTP = role;
      generatedOTP = Math.floor(100000 + Math.random() * 900000);

      alert("Your OTP is: " + generatedOTP); // DEMO ONLY

      document.getElementById("otp-section").style.display = "block";
      return; // 🔥 VERY IMPORTANT – STOP HERE
    }

    forgotPasswordMessage.textContent =
      "Incorrect username or password. Please try again.";
    forgotPasswordMessage.style.display = "block";
  });

  // ROLE CHANGE MESSAGE
  roleSelect.addEventListener("change", function () {
    const roleText = {
      student: "Logging in as student",
      staff: "Logging in as staff",
      warden: "Logging in as warden",
      parent: "Logging in as parent",
      admin: "Logging in as admin",
    };

    roleMessage.textContent = roleText[roleSelect.value] || "Select your role";

    if (roleSelect.value === "admin") {
      forgotPassword.classList.add("hidden");
    } else {
      forgotPassword.classList.remove("hidden");
    }
  });

  // FORGOT PASSWORD
  forgotPassword.addEventListener("click", function () {
    forgotPasswordMessage.textContent =
      "Contact Admin if you forgot your password.";
    forgotPasswordMessage.style.display = "block";
  });
});

// OTP VERIFY
function verifyOTP() {
  const enteredOTP = document.getElementById("otpInput").value;

  if (!enteredOTP) {
    alert("Please enter OTP");
    return;
  }

  if (parseInt(enteredOTP) === generatedOTP) {
    alert("OTP Verified Successfully ✅");
    redirectAfterOTP();
  } else {
    alert("Invalid OTP ❌");
  }
}

// REDIRECT AFTER OTP
function redirectAfterOTP() {
  switch (selectedRoleForOTP) {
    case "student":
      window.location.href = "./Comp/Hostel Student Dashboard/index.html";
      break;
    case "parent":
      window.location.href = "./Comp/Parent Dashboard/index.html";
      break;
    case "staff":
    case "warden":
      window.location.href = "./Comp/Hostel Staff Dashboard/index.html";
      break;
    case "admin":
      window.location.href = "./Comp/Admin Dashboard/index.html";
      break;
  }
}