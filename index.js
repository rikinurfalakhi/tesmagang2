const express = require("express");
const app = express();
app.use(express.json());

let inQueue = {}; // Menyimpan status antrian pengguna

async function sendFonnte(data) {
  const url = "https://api.fonnte.com/send";

  const customHeaders = {
    "Content-Type": "application/json",
    Authorization: TOKEN,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: customHeaders,
    body: JSON.stringify(data),
  });
  console.log(await response.json());
}

app.post("/webhook", function (req, res) {
  console.log(req.body);
  const sender = req.body.sender;
  const message = req.body.message;

  // Cek jika pengirim mengirim "antri"
  if (message.toLowerCase() === "antri") {
    inQueue[sender] = true; // Tandai pengirim dalam antrian
    const data = {
      target: sender,
      message: "Inputkan Nama Anda",
    };
    sendFonnte(data);
  } else if (inQueue[sender]) {
    // Jika pengirim sudah dalam antrian dan mengirim pesan lain
    console.log(`Pesan dari ${sender}: ${message}`);
    delete inQueue[sender]; // Keluarkan pengirim dari antrian
  } else {
    // Untuk pesan lainnya
    const data = {
      target: sender,
      message: "this is default reply from fonnte",
    };
    sendFonnte(data);
  }
  res.end();
});

app.listen(10008, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", 3000);
});
