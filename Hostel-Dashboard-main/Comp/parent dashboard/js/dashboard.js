document.addEventListener("DOMContentLoaded", () => {
  loadNotifications();
  loadOtpQrAlerts();

  // Poll every 10 seconds
  setInterval(() => {
    loadNotifications();
    loadOtpQrAlerts();
  }, 10000);
});

function loadNotifications() {

  // TEMP DUMMY DATA (remove when backend ready)
  const notifications = [
    { type: "success", message: "Outing approved for your ward" },
    { type: "info", message: "Student exited hostel at 6:30 PM" },
    { type: "success", message: "Student entered hostel at 9:10 PM" }
  ];

  renderNotifications(notifications);

  /*
  // FLASK API (enable later)
  fetch("http://127.0.0.1:5000/api/parent/notifications", {
    credentials: "include"
  })
  .then(res => res.json())
  .then(data => renderNotifications(data))
  .catch(err => console.error(err));
  */
}

function renderNotifications(list) {
  const ul = document.getElementById("notificationList");
  ul.innerHTML = "";

  if (list.length === 0) {
    ul.innerHTML = "<li class='info'>No notifications</li>";
    return;
  }

  list.forEach(n => {
    const li = document.createElement("li");
    li.className = n.type;
    li.innerText = n.message;
    ul.appendChild(li);
  });
}
function loadOtpQrAlerts() {

  // DUMMY DATA (replace with Flask API later)
  const alerts = [
    { type: "success", message: "Outing OTP generated at 5:45 PM" },
    { type: "info", message: "QR scanned for exit at 6:00 PM" },
    { type: "success", message: "QR scanned for entry at 9:10 PM" }
  ];

  renderOtpQrAlerts(alerts);

  /*
  fetch("http://127.0.0.1:5000/api/parent/otp-qr-alerts", {
    credentials: "include"
  })
  .then(res => res.json())
  .then(data => renderOtpQrAlerts(data))
  .catch(err => console.error(err));
  */
}

function renderOtpQrAlerts(list) {
  const ul = document.getElementById("otpQrAlerts");
  ul.innerHTML = "";

  if (list.length === 0) {
    ul.innerHTML = "<li class='info'>No OTP / QR alerts</li>";
    return;
  }

  list.forEach(a => {
    const li = document.createElement("li");
    li.className = a.type;
    li.innerText = a.message;
    ul.appendChild(li);
  });
}
function ackEmergency() {
  document.getElementById("ackStatus").innerText =
    "✅ Emergency acknowledged";

  // Backend ready
  /*
  fetch("http://127.0.0.1:5000/api/parent/emergency-ack", {
    method: "POST",
    credentials: "include"
  });
  */
}
function approveOuting() {
  document.getElementById("outingApprovalStatus").innerText =
    "✅ Outing approved. OTP sent.";

  // BACKEND READY
  /*
  fetch("/api/parent/outing/approve", { method: "POST" });
  */
}

function rejectOuting() {
  document.getElementById("outingApprovalStatus").innerText =
    "❌ Outing rejected.";

  /*
  fetch("/api/parent/outing/reject", { method: "POST" });
  */
}