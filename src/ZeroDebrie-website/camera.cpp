// ============================================================
//  camera.cpp
//  Egypt Observer-1 | Suez Canal Maritime Surveillance
//  ArduCAM OV2640 — ESP32 Implementation
//
//  SPI Bus:
//    CAM CS  = GPIO15  (CAM_CS_PIN)
//    MOSI    = GPIO23
//    MISO    = GPIO19
//    SCK     = GPIO18
//  I2C (SCCB):
//    SDA     = GPIO21
//    SCL     = GPIO22
// ============================================================
#include <Arduino.h>
#include <ArduCAM.h>
#include <SPI.h>
#include <Wire.h>
#include <memorysaver.h>
#include "camera.h"
#include "config.h"

static ArduCAM myCAM(OV2640, CAM_CS_PIN);

// ════════════════════════════════════════════════════════════
void cameraBegin() {
  pinMode(CAM_CS_PIN, OUTPUT);
  digitalWrite(CAM_CS_PIN, HIGH);

  Wire.begin(CAM_SDA, CAM_SCL);
  SPI.begin(CAM_SCK, CAM_MISO, CAM_MOSI, CAM_CS_PIN);

  myCAM.write_reg(0x07, 0x80); delay(100);
  myCAM.write_reg(0x07, 0x00); delay(100);

  myCAM.set_format(JPEG);
  myCAM.InitCAM();
  myCAM.OV2640_set_JPEG_size(OV2640_320x240);
  myCAM.clear_fifo_flag();
  myCAM.write_reg(ARDUCHIP_REV, 0x00);

  Serial.println(F("[OK] Camera (OV2640) initialized"));
}

// ════════════════════════════════════════════════════════════
bool captureAndSave(const char* filename) {
  digitalWrite(CAM_CS_PIN, LOW);

  myCAM.flush_fifo();
  myCAM.clear_fifo_flag();
  myCAM.start_capture();

  Serial.print(F("[CAM] Capturing..."));

  unsigned long start = millis();
  while (!myCAM.get_bit(ARDUCHIP_TRIG, CAP_DONE_MASK)) {
    if (millis() - start > 5000) {
      Serial.println(F(" TIMEOUT"));
      digitalWrite(CAM_CS_PIN, HIGH);
      return false;
    }
  }

  uint32_t imgSize = myCAM.read_fifo_length();
  if (imgSize == 0 || imgSize > 0x5FFFF) {
    Serial.println(F(" [ERR] Bad image size"));
    digitalWrite(CAM_CS_PIN, HIGH);
    return false;
  }

  Serial.print(F(" ")); Serial.print(imgSize);
  Serial.print(F(" bytes → ")); Serial.println(filename);

  digitalWrite(CAM_CS_PIN, HIGH);
  return true;
}
