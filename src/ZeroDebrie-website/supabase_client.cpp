#include<config.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>


void sendTelemetry(float temp, float lat, float lon, float alt, float vel, float fuel) {
  WiFiClientSecure client;
  client.setInsecure(); // مهم في Wokwi
  HTTPClient http;

  http.begin(client, SUPABASE_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  http.addHeader("Prefer", "return=minimal");

  // بناء JSON من قراءات السينسورز
  String body = "{";
  body += "\"temperature\":" + String(temp, 2) + ",";
  body += "\"latitude\":"    + String(lat, 6)  + ",";
  body += "\"longitude\":"   + String(lon, 6)  + ",";
  body += "\"altitude\":"    + String(alt, 2)  + ",";
  body += "\"velocity\":"    + String(vel, 2)  + ",";
  body += "\"fuel_level\":"  + String(fuel, 2);
  body += "}";

  int code = http.POST(body);
  Serial.println("Supabase response: " + String(code));
  http.end();}
  void supabaseBegin() {
  Serial.println(F("Connecting to WiFi..."));
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(F("."));
  }
  
  Serial.println(F("\n[OK] WiFi Connected"));
  
}
// ============================================================
//  supabase_client.h
//  Egypt Observer-1 | Supabase REST API Client
// ============================================================
#ifndef SUPABASE_CLIENT_H
#define SUPABASE_CLIENT_H

#include <Arduino.h>

void supabaseBegin();
void sendTelemetry( float temp, float lat, float lon, float alt, float speed, float fuel);

#endif // SUPABASE_CLIENT_H
