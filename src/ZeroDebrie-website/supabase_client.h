// ============================================================
//  supabase_client.h
//  Egypt Observer-1 | Supabase REST API Client
// ============================================================
#ifndef SUPABASE_CLIENT_H
#define SUPABASE_CLIENT_H

#include <Arduino.h>

void supabaseBegin();
void sendTelemetry(float dist, float temp, float speed,
                   int threshold, bool vessel,
                   bool alert, bool tempWarn);

#endif // SUPABASE_CLIENT_H
