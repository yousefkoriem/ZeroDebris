// ============================================================
//  camera.h
//  Egypt Observer-1 | Suez Canal Maritime Surveillance
//  ArduCAM OV2640 — Declarations
// ============================================================
#ifndef CAMERA_H
#define CAMERA_H

#include <Arduino.h>
#include "config.h"

void cameraBegin();
bool captureAndSave(const char* filename);

#endif // CAMERA_H
