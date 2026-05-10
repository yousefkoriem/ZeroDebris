// ============================================================
//  config.h
//  Egypt Observer-1 | Suez Canal Maritime Surveillance
//  ESP32 Version
// ============================================================
#ifndef CONFIG_H
#define CONFIG_H

// ── WiFi ────────────────────────────────────────────────────
#define WIFI_SSID        "Wokwi-GUEST"
#define WIFI_PASSWORD    ""

// ── Supabase ────────────────────────────────────────────────
#define SUPABASE_URL     "https://jcxinhhkxvrzaogafzjs.supabase.co/rest/v1/telemetry"
#define SUPABASE_KEY     "sb_publishable_y7Wy9Bla64p25MSAjpxaCQ_rTHEYs-g"

// ── HC-SR04 — Vessel Proximity Radar ───────────────────────
#define TRIG_PIN         5
#define ECHO_PIN         18

// ── DS18B20 — Environmental Temperature ────────────────────
#define TEMP_PIN         4

// ── Potentiometer — Safe Distance Threshold ────────────────
#define POT_PIN          34

// ── ArduCAM OV2640 — Vessel ID Camera (SPI) ────────────────
#define CAM_CS_PIN       15
#define CAM_MOSI         23
#define CAM_MISO         19
#define CAM_SCK          18
#define CAM_SDA          21
#define CAM_SCL          22

// ── Alert LED ──────────────────────────────────────────────
#define LED_PIN          2

// ── Mission Settings ────────────────────────────────────────
#define LOG_INTERVAL     2000
#define ALERT_LOCKOUT    5000
#define MIN_SAFE_DIST    20
#define MAX_SAFE_DIST    400
#define MAX_SAFE_TEMP    60.0
#define IMG_PREFIX       "VES_"
#define LOG_FILE         "vessel_log.csv"

#endif // CONFIG_H
