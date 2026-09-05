const reservationForm = document.querySelector("#reservation-form");
const reservationStatus = document.querySelector("#reservation-status");
const reservationDate = document.querySelector("#reservation-date");

reservationDate.min = new Date().toISOString().split("T")[0];

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const details = Object.fromEntries(new FormData(reservationForm).entries());
  const reservations = JSON.parse(localStorage.getItem("cafe-creme-reservations") || "[]");
  reservations.unshift({
    id: `RES-${Date.now().toString().slice(-6)}`,
    ...details,
    status: "Requested",
    createdAt: new Date().toISOString()
  });
  localStorage.setItem("cafe-creme-reservations", JSON.stringify(reservations));
  reservationStatus.textContent = "Your reservation request is saved for the Cafe-Creme team. We will confirm it shortly.";
  reservationStatus.className = "alert alert-success mt-4";
  reservationForm.reset();
  reservationDate.min = new Date().toISOString().split("T")[0];
});
