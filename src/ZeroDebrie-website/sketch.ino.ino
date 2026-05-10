// ============================================================
//  sketch.ino
//  Egypt Observer-1 — Suez Canal Maritime Surveillance
//  ESP32 | WiFi | Supabase
//
//  MISSION:
//    Detect vessels in Suez Canal, trigger proximity alerts,
//    capture images, log data to Supabase in real time.
//
//  FLOW:
//    1. SCAN    — HC-SR04 scans every 2s
//    2. ANALYSE — Compare distance to threshold (Pot)
//    3. ALERT   — LED + Camera capture if too close
//    4. UPLOAD  — Send telemetry to Supabase via WiFi
//
//  FILES:
//    config.h / sensors.h/.cpp / camera.h/.cpp
//    supabase_client.h/.cpp
//
//  LIBRARIES:
//    OneWire | DallasTemperature | ArduCAM | ArduinoJson
// ============================================================

#include "config.h"
#include "sensors.h"
#include "camera.h"
#include "supabase_client.h"

// ── State ───────────────────────────────────────────────────
float         prevDist    = -1;
unsigned long lastScan    = 0;
unsigned long lastAlert   = 0;
int           vesselCount = 0;
int           alertCount  = 0;
int           imgIndex    = 1;

// ════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);

  Serial.println(F("============================================="));
  Serial.println(F("  EGYPT OBSERVER-1"));
  Serial.println(F("  Suez Canal Maritime Surveillance System"));
  Serial.println(F("============================================="));

  sensorsBegin();
  cameraBegin();
  supabaseBegin();

  Serial.println(F("---------------------------------------------"));
  Serial.println(F("  STATUS   | DIST   | TEMP  | SPEED"));
  Serial.println(F("---------------------------------------------"));
}

// ════════════════════════════════════════════════════════════
void loop() {
  unsigned long now = millis();
  if (now - lastScan < LOG_INTERVAL) return;

  unsigned long dt = now - lastScan;
  lastScan = now;

  // ── 1. SCAN ─────────────────────────────────────────────
  float dist      = readDistance();
  float temp      = readTemperature();
  int   threshold = readThreshold();
  float speed     = estimateSpeed(dist, prevDist, dt);
  prevDist        = dist;
  float lat   = 30.0 + (analogRead(34) / 1024.0); 
  float lon   = 31.0 + (analogRead(35) / 1024.0); 
  float alt   = 0.0;
  float fuel  = map(analogRead(32), 0, 4095, 0, 100);
  // ── 2. ANALYSE ──────────────────────────────────────────
  bool vessel   = (dist > 0);
  bool tooClose = vessel && (dist < threshold);
  bool tempWarn = !systemTempOK(temp);
  bool newAlert = tooClose && (now - lastAlert > ALERT_LOCKOUT);

  if (vessel) vesselCount++;

  // ── 3. ALERT ────────────────────────────────────────────
  if (newAlert) {
    alertCount++;
    lastAlert = now;

    digitalWrite(LED_PIN, HIGH);

    char imgName[16];
    sprintf(imgName, "%s%04d.jpg", IMG_PREFIX, imgIndex);

    Serial.println(F(""));
    Serial.println(F("  *** PROXIMITY ALERT — VESSEL TOO CLOSE ***"));

    if (captureAndSave(imgName)) imgIndex++;

    delay(500);
    digitalWrite(LED_PIN, LOW);
  }

  // ── 4. SERIAL REPORT ────────────────────────────────────
  if (tooClose)     Serial.print(F("  [ALERT!] "));
  else if (vessel)  Serial.print(F("  [VESSEL] "));
  else              Serial.print(F("  [CLEAR ] "));

  if (dist < 0) Serial.print(F("  ---  "));
  else { Serial.print(dist, 1); Serial.print(F("cm")); }

  Serial.print(F(" | "));
  if (temp <= -999) Serial.print(F("ERR  "));
  else {
    Serial.print(temp, 1); Serial.print(F("C"));
    if (tempWarn) Serial.print(F("!"));
  }

  Serial.print(F(" | ")); Serial.print(speed, 1); Serial.print(F("cm/s"));
  Serial.print(F(" | Thr:")); Serial.print(threshold); Serial.print(F("cm"));
  Serial.print(F(" | V:")); Serial.print(vesselCount);
  Serial.print(F(" A:")); Serial.println(alertCount);

  // ── 5. UPLOAD TO SUPABASE ───────────────────────────────
  sendTelemetry(temp, lat, lon, alt, speed, fuel);
}
