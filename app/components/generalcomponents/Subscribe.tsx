"use client";

import { useState, useEffect } from "react";
import { subscribeUser } from "../../actions";

function urlBase64ToUint8Array(base64String: string) {
  try {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error("Error decoding Base64 string:", error);
    return new Uint8Array(); // return an empty array if decoding fails
  }
}

const PushNotificationManager = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);

      const promptUserToSubscribe = async () => {
        const shouldSubscribe = window.confirm(
          "Would you like to subscribe to push notifications?"
        );
        if (shouldSubscribe) {
          await subscribeToPush();
        }
      };

      const registerServiceWorker = async () => {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);

        // Prompt user to subscribe if they aren't already subscribed
        if (!sub) {
          promptUserToSubscribe();
        }
      };

      registerServiceWorker();
    }
  }, []);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    await subscribeUser(sub);

    alert("You are now subscribed to push notifications!");
  }

  // If push notifications are unsupported or user is already subscribed, display nothing
  if (!isSupported || subscription) {
    return null;
  }

  return null;
};

export default PushNotificationManager;
