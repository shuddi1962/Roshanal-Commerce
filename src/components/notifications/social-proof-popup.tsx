"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { products } from "@/lib/demo-data";

const nigerianNames = [
  "John", "Amara", "Chidi", "Fatima", "Emeka", "Ngozi", "Tunde", "Kemi",
  "Ibrahim", "Chioma", "Olawale", "Aisha", "Obinna", "Yetunde", "Ahmed",
  "Adaeze", "Segun", "Zainab", "Ifeanyi", "Halima", "Bayo", "Nkechi",
];

const nigerianCities = [
  "Lagos", "Port Harcourt", "Abuja", "Enugu", "Kano", "Ibadan", "Benin City",
  "Warri", "Calabar", "Uyo", "Owerri", "Kaduna", "Jos", "Abeokuta",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SocialProofPopup() {
  const { socialProofEnabled, addNotification } = useNotificationStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socialProofEnabled) return;

    const showProof = () => {
      const product = getRandomItem(products);
      const name = getRandomItem(nigerianNames);
      const city = getRandomItem(nigerianCities);
      const minutes = Math.floor(Math.random() * 30) + 1;

      addNotification({
        type: "social-proof",
        title: `${name} from ${city}`,
        message: `just purchased ${product.name}`,
        productName: product.name,
        duration: 5000,
      });
    };

    // First popup after 15 seconds
    const initialTimeout = setTimeout(() => {
      showProof();
      // Then every 30-60 seconds
      intervalRef.current = setInterval(
        showProof,
        (Math.random() * 30 + 30) * 1000
      );
    }, 15000);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [socialProofEnabled, addNotification]);

  return null;
}
