function viewDetails(complaintId) {
    // Example function to handle the view details action
    // Redirect to the complaint details page or open a modal
    window.location.href = `Complaint-Details.html?id=${complaintId}`;
}
function sendNotification() {

  const type = document.getElementById("notifyType").value;
  const message = document.getElementById("notifyMessage").value;

  if (!message.trim()) {
    alert("Message cannot be empty");
    return;
  }

  document.getElementById("notifyStatus").innerText =
    "✅ Notification sent successfully";

  // BACKEND API READY
  /*
  fetch("http://127.0.0.1:5000/api/warden/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: type,
      message: message
    })
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
  */
}
let wardenVideoStream;

/* GENERATE ATTENDANCE QR */
function generateAttendanceQR() {
  const sessionToken = "ATTEND_" + Date.now(); // dummy token

  document.getElementById("attendanceQR").innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${sessionToken}">
    <p>QR valid for 5 minutes</p>
  `;

  // BACKEND READY
  /*
  fetch("/api/attendance/start", {
    method: "POST",
    body: JSON.stringify({ token: sessionToken })
  });
  */
}

/* START QR SCANNER (WARDEN SIDE) */
function startWardenQRScanner() {
  const video = document.getElementById("wardenQRVideo");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      wardenVideoStream = stream;
      video.srcObject = stream;

      setTimeout(() => {
        stopWardenScanner();
        document.getElementById("wardenScanStatus").innerText =
          "✅ Student attendance recorded";
      }, 4000); // simulate scan
    })
    .catch(() => {
      alert("Camera access denied");
    });
}

/* STOP CAMERA */
function stopWardenScanner() {
  if (wardenVideoStream) {
    wardenVideoStream.getTracks().forEach(track => track.stop());
  }
}
function markResolved(complaintId) {
  alert("Complaint " + complaintId + " marked as Resolved ✅");

  // BACKEND READY
  /*
  fetch(`/api/staff/complaint/${complaintId}/resolve`, {
    method: "POST"
  });
  */
}
setInterval(() => {
  document.querySelectorAll(".slaTimer").forEach(timer => {
    let time = parseInt(timer.dataset.time);
    if (time > 0) {
      time--;
      timer.dataset.time = time;
      timer.innerText = formatTime(time);
    } else {
      timer.innerText = "⚠ SLA Exceeded";
      timer.style.color = "red";
    }
  });
}, 1000);

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}
function openAttachment(file) {
  const viewer = document.getElementById("attachmentViewer");
  const modal = document.getElementById("attachmentModal");

  if (file.endsWith(".pdf")) {
    viewer.innerHTML = `<iframe src="./uploads/${file}" width="100%" height="400px"></iframe>`;
  } else {
    viewer.innerHTML = `<img src="./uploads/${file}" style="max-width:100%">`;
  }

  modal.style.display = "block";
}

function closeAttachment() {
  document.getElementById("attachmentModal").style.display = "none";
}
function filterComplaints() {
  const status = document.getElementById("statusFilter").value;
  const date = document.getElementById("dateFilter").value;

  const rows = document.querySelectorAll(".complaints-table tbody tr");

  rows.forEach(row => {
    const rowStatus = row.children[2].innerText;
    const rowDate = row.children[3].innerText;

    let show = true;

    if (status !== "all" && rowStatus !== status) {
      show = false;
    }

    if (date && rowDate !== date) {
      show = false;
    }

    row.style.display = show ? "" : "none";
  });
}
function generateOutingOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("wardenOtp").innerText = otp;

  alert("OTP generated and sent to parent & student");

  // BACKEND READY
  /*
  fetch("/api/warden/outing/otp", {
    method: "POST",
    body: JSON.stringify({ otp })
  });
  */
}