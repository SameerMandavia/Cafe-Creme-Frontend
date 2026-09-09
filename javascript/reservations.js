const reservationForm = document.querySelector("#reservation-form");
const reservationStatus = document.querySelector("#reservation-status");
const reservationDate = document.querySelector("#reservation-date");

reservationDate.min = new Date().toISOString().split("T")[0];

reservationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const details = Object.fromEntries(new FormData(reservationForm).entries());
  if (window.CafeCremeApi && localStorage.getItem("cafe-creme-api-token")) {
    try {
      await window.CafeCremeApi.createReservation({ guestName: details.name, phone: details.phone, guests: Number(details.guests), reservationTime: `${details.date}T${details.time}:00+05:30`, note: details.note || "" });
      reservationStatus.textContent = "Your reservation request is sent to the Cafe-Creme team. We will notify you when it is confirmed.";
      reservationStatus.className = "alert alert-success mt-4"; reservationForm.reset(); reservationDate.min = new Date().toISOString().split("T")[0];
    } catch (error) { reservationStatus.textContent = "We could not send your reservation. Please try again."; reservationStatus.className = "alert alert-danger mt-4"; }
    return;
  }
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
