let gateStream;

// Track used QR tokens (frontend simulation)
let usedTokens = {};

function startGateScanner() {
  const video = document.getElementById("gateQRVideo");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      gateStream = stream;
      video.srcObject = stream;

      // Simulate QR read after 4 seconds
      setTimeout(() => {
        stopGateScanner();

        const dummyQR = "OUTING_22CS045_123456"; // Simulated QR token
        verifyOutingQR(dummyQR);

      }, 4000);
    })
    .catch(() => {
      alert("Camera access denied");
    });
}

function stopGateScanner() {
  if (gateStream) {
    gateStream.getTracks().forEach(track => track.stop());
  }
}

function verifyOutingQR(token) {

  const now = Date.now();
  const expiryTime = 5 * 60 * 1000; // 5 min validity

  if (usedTokens[token]) {
    document.getElementById("gateScanResult").innerText =
      "❌ QR Already Used!";
    return;
  }

  // Simulated expiry check
  const tokenTimestamp = 123456; // Replace with parsed timestamp later

  if (now - tokenTimestamp > expiryTime) {
    document.getElementById("gateScanResult").innerText =
      "❌ QR Expired!";
    return;
  }

  // Mark as used
  usedTokens[token] = true;

  document.getElementById("gateScanResult").innerText =
    "✅ Exit/Entry Verified";

  addGateLog("22CS045", "EXIT");
}

function addGateLog(studentId, action) {
  const table = document.getElementById("gateLogTable");

  const row = table.insertRow();
  row.insertCell(0).innerText = studentId;
  row.insertCell(1).innerText = action;
  row.insertCell(2).innerText = new Date().toLocaleTimeString();
}