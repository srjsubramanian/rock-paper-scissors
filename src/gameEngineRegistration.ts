export const register = () => {
  console.log("service worker registration");
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then(function () {
        console.log("Game Engine Registered");
      });
  }
};
