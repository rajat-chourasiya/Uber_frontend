// utils/loadGoMaps.js
export const loadGoMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('gomaps-script');
    if (existingScript) {
      existingScript.onload = resolve;
      existingScript.onerror = reject;
      return;
    }

    const apiKey = import.meta.env.VITE_GO_MAPS_API_KEY;
    const script = document.createElement('script');
    script.id = 'gomaps-script';
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
};
