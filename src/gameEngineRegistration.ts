export const register = () => {
  console.log("service worker registration");
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js", {
        scope: "/",
      })
      .then((registration) => {
        console.log("service worker registered");
        // if (registration && registration.waiting) {
        //   registration.waiting.postMessage({ type: "SKIP_WAITING" });
        // }
        // window.location.reload();
      });
  }
};
