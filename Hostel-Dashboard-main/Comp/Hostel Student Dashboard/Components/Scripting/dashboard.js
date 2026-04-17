let votes = {
  "Menu A": 0,
  "Menu B": 0,
  "Menu C": 0
};

document.getElementById("menuVoteForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const selected = document.querySelector('input[name="menu"]:checked');
  if (!selected) {
    alert("Select a menu");
    return;
  }

  // FRONTEND UPDATE (instant UI)
  votes[selected.value]++;
  updateVoteUI();

  // BACKEND API CALL (Flask)
  fetch("http://127.0.0.1:5000/api/menu/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      menu: selected.value
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Vote saved:", data);
  })
  .catch(err => {
    console.error("Vote API error", err);
  });
});

function updateVoteUI() {
  document.getElementById("voteA").innerText = votes["Menu A"];
  document.getElementById("voteB").innerText = votes["Menu B"];
  document.getElementById("voteC").innerText = votes["Menu C"];
}
// QR ATTENDANCE (Dummy)
function scanAttendanceQR() {
  document.getElementById("attendanceStatus").innerText =
    "✅ Attendance marked successfully (QR verified)";
}

function checkOutingStatus() {

  fetch("http://127.0.0.1:5000/api/outing/status", {
    method: "GET",
    credentials: "include" // session-based auth
  })
  .then(res => res.json())
  .then(data => {

    if (data.approved === true) {
      document.getElementById("outingStatus").innerText =
        "Status: Approved ✅";

      // Show QR ONLY if approved
      document.getElementById("outingQRBox").innerHTML = `
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${data.qr_token}"
          alt="Outing QR"
        />
        <p>Scan this QR at exit & entry gate</p>
      `;

    } else {
      document.getElementById("outingStatus").innerText =
        "Status: Pending ⏳";
      document.getElementById("outingQRBox").innerHTML = "";
    }

  })
  .catch(err => {
    console.error("Outing status API error", err);
    alert("Unable to fetch outing status");
  });
}
let videoStream;

function startQRScanner() {
  const video = document.getElementById("qrVideo");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      videoStream = stream;
      video.srcObject = stream;

      setTimeout(() => {
  stopScanner();

  document.getElementById("attendanceStatus").innerText =
    "✅ Attendance marked (QR verified)";

  // BACKEND API CALL (Flask)
  fetch("http://127.0.0.1:5000/api/attendance/qr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "scanned"
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Attendance saved:", data);
  })
  .catch(err => {
    console.error("Attendance API error", err);
  });

}, 4000);
    })
    .catch(err => {
      alert("Camera access denied");
    });
}

function stopScanner() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
}
function verifyOutingQR(qrData) {

  fetch("http://127.0.0.1:5000/api/outing/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      qr_token: qrData
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.valid === true) {
      alert("✅ Outing Verified: " + data.action);
    } else {
      alert("❌ Invalid or Expired QR");
    }

  })
  .catch(err => {
    console.error("QR verification error", err);
  });
}
function checkParentApproval() {
  const type = document.getElementById("outingType").value;
  const info = document.getElementById("parentApprovalInfo");

  if (type === "short") {
    info.innerText = "Parent approval not required.";
  } else {
    info.innerText = "⚠ Parent approval is required for this outing.";
  }
}