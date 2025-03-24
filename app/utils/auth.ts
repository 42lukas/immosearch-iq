/**
 * Diese Funktion liefert eine eindeutige Benutzer-ID, die im localStorage gespeichert wird.
 * Falls noch keine ID vorhanden ist, wird eine neue UUID generiert, gespeichert und zurückgegeben.
 */
export const getUserId = (): string => {
  let userId = localStorage.getItem("userId");
  
  if (!userId) {
    userId = crypto.randomUUID(); // Erzeugt eine neue, zufällige UUID
    // Speichere die neu generierte UUID im localStorage
    localStorage.setItem("userId", userId);
  }
  return userId;
};
