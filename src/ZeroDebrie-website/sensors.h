// ============================================================
//  sensors.h
//  Egypt Observer-1 | Suez Canal Maritime Surveillance
//  ESP32 Version — Declarations only
// ============================================================
#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include "config.h"

// ── Function Declarations ───────────────────────────────────
void  sensorsBegin();
float readDistance();
float readTemperature();
int   readThreshold();

// ── Inline Helpers ──────────────────────────────────────────
inline float estimateSpeed(float now, float prev, unsigned long dt) {
  if (now < 0 || prev < 0 || dt == 0) return 0;
  return ((prev - now) / (float)dt) * 1000.0f;
}

inline bool systemTempOK(float temp) {
  if (temp <= -999) return true;
  return (temp < MAX_SAFE_TEMP);
}

#endif // SENSORS_H
