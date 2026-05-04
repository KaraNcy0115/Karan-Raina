import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const TimeUnit = ({
  value, label, index, light = false
}: {
  value: number; label: string; index: number; light?: boolean;
}) => (
  <>
    {index > 0 && <div className="countdown-divider" />}
    <div className="countdown-unit">
      <span className={`countdown-number ${light ? 'countdown-number-light' : ''}`}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className={`countdown-label ${light ? 'countdown-label-light' : ''}`}>
        {label}
      </span>
    </div>
  </>
);

export const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    const timer = setInterval(calc, 1000);
    calc();
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="countdown-plaque mt-10 mb-8"
    >
      <TimeUnit value={timeLeft.days} label="Days" index={0} />
      <TimeUnit value={timeLeft.hours} label="Hours" index={1} />
      <TimeUnit value={timeLeft.minutes} label="Mins" index={2} />
      <TimeUnit value={timeLeft.seconds} label="Secs" index={3} />
    </motion.div>
  );
};

export const CountdownTimerLight = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    const timer = setInterval(calc, 1000);
    calc();
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-plaque countdown-plaque-light mt-6 mb-2">
      <TimeUnit value={timeLeft.days} label="Days" index={0} light />
      <TimeUnit value={timeLeft.hours} label="Hours" index={1} light />
      <TimeUnit value={timeLeft.minutes} label="Mins" index={2} light />
      <TimeUnit value={timeLeft.seconds} label="Secs" index={3} light />
    </div>
  );
};

export default CountdownTimer;
