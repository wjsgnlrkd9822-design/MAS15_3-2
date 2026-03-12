import { useState, useEffect } from 'react';
import { getActiveReservation } from '../apis/reservationApi';

export function useActiveReservation() {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActiveReservation()
      .then((data) => {
        if (data.success && data.reservation) {
          setReservation(data.reservation);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { reservation, loading, error };
}
