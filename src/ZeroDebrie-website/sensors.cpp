// ============================================================
//  sensors.cpp
//  Egypt Observer-1 | Suez Canal Maritime Surveillance
//  ESP32 Version
// ============================================================
#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "sensors.h"
#include "config.h"

static OneWire           oneWire(TEMP_PIN);
static DallasTemperature tempSensor(&oneWire);

// ════════════════════════════════════════════════════════════
void sensorsBegin() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN,  OUTPUT);
  digitalWrite(TRIG_PIN, LOW);
  digitalWrite(LED_PIN,  LOW);
  tempSensor.begin();
  Serial.println(F("[OK] Sensors initialized"));
}

// ════════════════════════════════════════════════════════════
// HC-SR04 — Vessel Proximity Radar
// Returns distance in cm | -1 = no object / timeout
// ════════════════════════════════════════════════════════════
float readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);
  if (duration == 0) return -1;

  float dist = duration * 0.0343f / 2.0f;
  return (dist > 400) ? -1 : dist;
}

// ════════════════════════════════════════════════════════════
// DS18B20 — Environmental Temperature
// Returns °C | -999 = disconnected
// ════════════════════════════════════════════════════════════
float readTemperature() {
  tempSensor.requestTemperatures();
  float t = tempSensor.getTempCByIndex(0);
  return (t == DEVICE_DISCONNECTED_C) ? -999 : t;
}

// ════════════════════════════════════════════════════════════
// Potentiometer — Maps 0-4095 → MIN_SAFE_DIST to MAX_SAFE_DIST
// ════════════════════════════════════════════════════════════
int readThreshold() {
  return map(analogRead(POT_PIN), 0, 4095, MIN_SAFE_DIST, MAX_SAFE_DIST);
}
