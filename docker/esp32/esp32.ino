#include <Adafruit_Fingerprint.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>
#include <WebServer.h>
#include <WiFi.h>

// ================== CONFIGURACIÓN ==================
#define RX_PIN 16         // ESP32 RX2 (conectado a TX del AS608)
#define TX_PIN 17         // ESP32 TX2 (conectado a RX del AS608)
#define FINGER_BAUD 57600 // Velocidad del AS608

// <<< EDITA ESTO >>>
const char *WIFI_SSID = "Funcionarios";
const char *WIFI_PASS = "SomosSena_2025*++*";

// URL base de tu API NestJS (IP/puerto de tu servidor)
// Ej: "http://172.22.129.50:3000"
String API_BASE = "http://10.2.126.96:3000";

// Debe coincidir con process.env.DEVICE_KEY en tu backend NestJS
String DEVICE_KEY =
    "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8";
// ================== FIN CONFIG =====================

// ================== GLOBALES ==================
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger(&mySerial);
WebServer server(80);

// Anti-rebote para no spamear tu API
unsigned long lastPostMs = 0;
const unsigned long DEBOUNCE_MS = 2500;

// Estado WiFi + eventos
enum WifiState { WIFI_IDLE, WIFI_CONNECTING, WIFI_CONNECTED, WIFI_FAILED };
WifiState wifiState = WIFI_IDLE;
unsigned long lastAttempt = 0;

// ====== Enrolamiento asíncrono (máquina de estados) ======
enum EnrollStep {
  ENR_IDLE,
  ENR_WAIT_FINGER_1,
  ENR_CAPTURE_1,
  ENR_WAIT_REMOVE,
  ENR_WAIT_FINGER_2,
  ENR_CAPTURE_2,
  ENR_CREATE_MODEL,
  ENR_STORE_MODEL,
  ENR_SUCCESS,
  ENR_ERROR
};

struct EnrollCtx {
  EnrollStep step = ENR_IDLE;
  uint16_t slot = 0; // id_persona (1..127)
  int lastErr = 0;   // código de error del sensor (si aplica)
  unsigned long stepStart = 0;
} enr;

// ================== HELPERS ==================
void printFpCode(int code) {
  switch (code) {
  case FINGERPRINT_OK:
    Serial.println("OK");
    break;
  case FINGERPRINT_NOFINGER:
    Serial.println("No hay dedo");
    break;
  case FINGERPRINT_IMAGEFAIL:
    Serial.println("Fallo al capturar imagen");
    break;
  case FINGERPRINT_IMAGEMESS:
    Serial.println("Imagen con ruido");
    break;
  case FINGERPRINT_FEATUREFAIL:
    Serial.println("No se pudieron extraer rasgos");
    break;
  case FINGERPRINT_INVALIDIMAGE:
    Serial.println("Imagen inválida");
    break;
  case FINGERPRINT_ENROLLMISMATCH:
    Serial.println("Las dos capturas no coinciden");
    break;
  case FINGERPRINT_BADLOCATION:
    Serial.println("Slot inválido");
    break;
  case FINGERPRINT_FLASHERR:
    Serial.println("Error al escribir memoria");
    break;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Error de comunicación");
    break;
  default:
    Serial.printf("Código: %d\n", code);
  }
}

const char *stepName(EnrollStep s) {
  switch (s) {
  case ENR_IDLE:
    return "idle";
  case ENR_WAIT_FINGER_1:
    return "place_1";
  case ENR_CAPTURE_1:
    return "capture_1";
  case ENR_WAIT_REMOVE:
    return "remove";
  case ENR_WAIT_FINGER_2:
    return "place_2";
  case ENR_CAPTURE_2:
    return "capture_2";
  case ENR_CREATE_MODEL:
    return "creating";
  case ENR_STORE_MODEL:
    return "storing";
  case ENR_SUCCESS:
    return "success";
  case ENR_ERROR:
    return "error";
  }
  return "unknown";
}

void setStep(EnrollStep s) {
  enr.step = s;
  enr.stepStart = millis();
  Serial.printf("[ENR] step -> %s\n", stepName(s));
}

// Buscar huella → devuelve id_sensor (slot) o -1
int buscarHuella() {
  int p = finger.getImage();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)
    return -1;

  return finger.fingerID;
}

// POST /acceso/evento con id_sensor
bool postAccesoEvento(int idSensor) {
  if (WiFi.status() != WL_CONNECTED)
    return false;

  HTTPClient http;
  String url = API_BASE + "/acceso/evento";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-key", DEVICE_KEY);

  String body = String("{\"id_sensor\":") + idSensor + "}";
  int code = http.POST(body);
  String resp = http.getString();
  http.end();

  Serial.printf("POST %s -> %d\n", url.c_str(), code);
  Serial.println(resp);
  return (code >= 200 && code < 300);
}

// Parseo simple de {"id_persona": N}
int parseIdPersona(const String &json) {
  int pos = json.indexOf("id_persona");
  if (pos < 0)
    return -1;
  int colon = json.indexOf(':', pos);
  if (colon < 0)
    return -1;
  int i = colon + 1;
  while (i < (int)json.length() &&
         (json[i] == ' ' || json[i] == '\t' || json[i] == '\"'))
    i++;
  String num;
  while (i < (int)json.length() && isDigit(json[i]))
    num += json[i++];
  return num.toInt();
}

// ================== ENROLL ASÍNCRONO ==================
void tickEnroll() {
  switch (enr.step) {
  case ENR_IDLE:
    return;

  case ENR_WAIT_FINGER_1: {
    int p = finger.getImage();
    if (p == FINGERPRINT_OK)
      setStep(ENR_CAPTURE_1);
    else if (p == FINGERPRINT_IMAGEFAIL) {
      enr.lastErr = p;
      setStep(ENR_ERROR);
    }
    break;
  }

  case ENR_CAPTURE_1: {
    int p = finger.image2Tz(1);
    Serial.print("[ENR] image2Tz(1): ");
    printFpCode(p);
    if (p == FINGERPRINT_OK)
      setStep(ENR_WAIT_REMOVE);
    else {
      enr.lastErr = p;
      setStep(ENR_ERROR);
    }
    break;
  }

  case ENR_WAIT_REMOVE: {
    int p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER)
      setStep(ENR_WAIT_FINGER_2);
    break;
  }

  case ENR_WAIT_FINGER_2: {
    int p = finger.getImage();
    if (p == FINGERPRINT_OK)
      setStep(ENR_CAPTURE_2);
    else if (p == FINGERPRINT_IMAGEFAIL) {
      enr.lastErr = p;
      setStep(ENR_ERROR);
    }
    break;
  }

  case ENR_CAPTURE_2: {
    int p = finger.image2Tz(2);
    Serial.print("[ENR] image2Tz(2): ");
    printFpCode(p);
    if (p == FINGERPRINT_OK)
      setStep(ENR_CREATE_MODEL);
    else {
      enr.lastErr = p;
      setStep(ENR_ERROR);
    }
    break;
  }

  case ENR_CREATE_MODEL: {
    int p = finger.createModel();
    Serial.print("[ENR] createModel: ");
    printFpCode(p);
    if (p == FINGERPRINT_OK)
      setStep(ENR_STORE_MODEL);
    else {
      enr.lastErr = p;
      setStep(ENR_ERROR);
    }
    break;
  }

  case ENR_STORE_MODEL: {
    int p = finger.storeModel(enr.slot);
    Serial.print("[ENR] storeModel: ");
    printFpCode(p);
    if (p == FINGERPRINT_OK)
      setStep(ENR_SUCCESS);
    else {
      enr.lastErr = p;
      setStep(ENR_ERROR);
    }
    break;
  }

  case ENR_SUCCESS:
  case ENR_ERROR:
    // Espera a que el backend consulte status o cancele
    break;
  }
}

// ================== HANDLERS HTTP ==================
void handleRoot() {
  server.send(200, "text/plain",
              "ESP32 AS608 listo.\n"
              "GET  /ping\n"
              "POST /sensor/enroll/start {id_persona}\n"
              "GET  /sensor/enroll/status\n"
              "POST /sensor/enroll/cancel\n"
              "POST /sensor/enroll       {id_persona} (sincrono)\n"
              "POST /sensor/delete       {id_persona}\n");
}

void handlePing() { server.send(200, "text/plain", "pong"); }

// ---- Async ----
void handleEnrollStart() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method not allowed");
    return;
  }
  if (!server.hasArg("plain")) {
    server.send(400, "text/plain", "Missing body");
    return;
  }
  String body = server.arg("plain");
  int id = parseIdPersona(body);
  if (id < 1 || id > 127) {
    server.send(400, "application/json",
                "{\"ok\":false,\"error\":\"slot 1..127\"}");
    return;
  }

  enr.slot = id;
  enr.lastErr = 0;
  setStep(ENR_WAIT_FINGER_1);
  server.send(202, "application/json", "{\"ok\":true,\"started\":true}");
}

void handleEnrollStatus() {
  String json = String("{\"ok\":true,") + "\"step\":\"" +
                String(stepName(enr.step)) + "\"," + "\"slot\":" + enr.slot +
                "," + "\"error\":" + enr.lastErr + "}";
  server.send(200, "application/json", json);
}

void handleEnrollCancel() {
  enr.slot = 0;
  enr.lastErr = 0;
  setStep(ENR_IDLE);
  server.send(200, "application/json", "{\"ok\":true,\"cancelled\":true}");
}

// ---- Sync (útiles para Postman) ----
bool deleteSlot(uint16_t id) {
  Serial.printf("Borrando slot #%u ...\n", id);
  int p = finger.deleteModel(id);
  Serial.print("deleteModel: ");
  printFpCode(p);
  return (p == FINGERPRINT_OK);
}

bool enrollAt(uint16_t id) {
  Serial.println();
  Serial.printf("=== Enrolando en slot #%u (sync) ===\n", id);

  int p;
  // Captura 1
  Serial.println("Coloca el dedo (1/2)...");
  while ((p = finger.getImage()) != FINGERPRINT_OK) {
    if (p == FINGERPRINT_IMAGEFAIL) {
      Serial.println("Error de imagen");
      return false;
    }
    delay(70);
  }
  p = finger.image2Tz(1);
  Serial.print("image2Tz(1): ");
  printFpCode(p);
  if (p != FINGERPRINT_OK)
    return false;

  // Retirar
  Serial.println("Retira el dedo...");
  while (finger.getImage() != FINGERPRINT_NOFINGER)
    delay(70);

  // Captura 2
  Serial.println("Coloca el MISMO dedo (2/2)...");
  while ((p = finger.getImage()) != FINGERPRINT_OK) {
    if (p == FINGERPRINT_IMAGEFAIL) {
      Serial.println("Error de imagen");
      return false;
    }
    delay(70);
  }
  p = finger.image2Tz(2);
  Serial.print("image2Tz(2): ");
  printFpCode(p);
  if (p != FINGERPRINT_OK)
    return false;

  // Modelo + guardar
  p = finger.createModel();
  Serial.print("createModel: ");
  printFpCode(p);
  if (p != FINGERPRINT_OK)
    return false;

  p = finger.storeModel(id);
  Serial.print("storeModel: ");
  printFpCode(p);
  if (p != FINGERPRINT_OK)
    return false;

  Serial.println("✅ Huella enrolada y guardada con éxito");
  return true;
}

void handleEnrollSync() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method not allowed");
    return;
  }
  if (!server.hasArg("plain")) {
    server.send(400, "text/plain", "Missing body");
    return;
  }
  String body = server.arg("plain");
  int id = parseIdPersona(body);
  if (id < 1 || id > 127) {
    server.send(400, "application/json",
                "{\"ok\":false,\"error\":\"slot 1..127\"}");
    return;
  }

  bool ok = enrollAt(id);
  server.send(ok ? 200 : 500, "application/json",
              ok ? "{\"ok\":true}" : "{\"ok\":false}");
}

void handleDelete() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method not allowed");
    return;
  }
  if (!server.hasArg("plain")) {
    server.send(400, "text/plain", "Missing body");
    return;
  }
  String body = server.arg("plain");
  int id = parseIdPersona(body);
  if (id < 1 || id > 127) {
    server.send(400, "application/json",
                "{\"ok\":false,\"error\":\"slot 1..127\"}");
    return;
  }

  bool ok = deleteSlot(id);
  server.send(ok ? 200 : 500, "application/json",
              ok ? "{\"ok\":true}" : "{\"ok\":false}");
}

bool handleFindFinger() {
  int p;
  while ((p = finger.getImage()) != FINGERPRINT_OK) {
    if (p == FINGERPRINT_NOFINGER) {
      delay(70);
      continue;
    }
    if (p == FINGERPRINT_IMAGEFAIL) {
      Serial.println("Error: fallo al capturar la imagen (IMAGEFAIL).");
      return false;
    }
    Serial.print("getImage: error inesperado ");
    Serial.println(p);
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) {
    Serial.print("image2Tz fallo: ");
    Serial.println(p);
    return false;
  }

  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {

    Serial.println("Esperando a que se retire el dedo...");
    while (finger.getImage() == FINGERPRINT_OK) {
      delay(50);
    }

    int foundID = finger.fingerID;
    int conf = finger.confidence;
    String response = String("{\"ok\":\"success\",\"data\":{") +
                  "\"id_registro\":" + String(foundID) + "," +
                  "\"confianza\":" + String(conf) +
                  "}}";

    server.send(200, "application/json", response);
    Serial.print("Huella encontrada! ID=");
    Serial.print(foundID);
    Serial.print("  Confianza=");
    Serial.println(conf);
    return true;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Huella no encontrada en la base de datos.");
    server.send(404, "aplication/json",
                "{\"ok\": false, \"message\": \"No registrada\"}");

    return false;
    Serial.println("Retira el dedo para continuar...");
    while (finger.getImage() == FINGERPRINT_OK) {
      delay(50);
    }
  } else {
    Serial.print("fingerFastSearch: error ");
    Serial.println(p);
    return false;
  }
}

void handleDeleteMemory() {
  int tmp = finger.emptyDatabase();
  if (tmp != FINGERPRINT_OK) {
    Serial.println("Exitoso");
  }
  Serial.println(tmp);
}

// ================== WiFi (eventos para ESP32 core v2.x) ==================
void onWiFiEvent(WiFiEvent_t event, WiFiEventInfo_t info) {
  switch (event) {
  case WIFI_EVENT_STA_START:
    Serial.println("[WiFi] STA_START");
    break;
  case WIFI_EVENT_STA_CONNECTED:
    Serial.println("[WiFi] CONNECTED");
    break;
  case IP_EVENT_STA_GOT_IP:
    Serial.print("[WiFi] GOT_IP: ");
    Serial.println(WiFi.localIP());
    wifiState = WIFI_CONNECTED;
    break;
  case WIFI_EVENT_STA_DISCONNECTED:
    Serial.printf("[WiFi] DISCONNECTED, reason=%d\n",
                  info.wifi_sta_disconnected.reason);
    wifiState = WIFI_FAILED;
    break;
  default:
    break;
  }
}

void beginWiFiOnce() {
  if (wifiState == WIFI_CONNECTING)
    return;
  wifiState = WIFI_CONNECTING;

  WiFi.mode(WIFI_STA);
  WiFi.persistent(false);
  WiFi.setSleep(false);
  WiFi.disconnect(true, true);
  delay(250);

  Serial.printf("Conectando a WiFi: '%s' ...\n", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  lastAttempt = millis();
}

void connectWiFi() {
  beginWiFiOnce();
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi OK. IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println(
        "No se pudo conectar a WiFi. Continuando en modo offline...");
  }
}

void maintainWiFi() {
  if (wifiState == WIFI_CONNECTED)
    return;
  if (wifiState == WIFI_FAILED || wifiState == WIFI_IDLE) {
    Serial.println("[WiFi] Reintentando conexión...");
    beginWiFiOnce();
  }
}

// ================== SETUP/LOOP ==================
void setup() {
  Serial.begin(115200);
  delay(200);

  WiFi.onEvent(onWiFiEvent);
  connectWiFi();

  // Sensor
  mySerial.begin(FINGER_BAUD, SERIAL_8N1, RX_PIN, TX_PIN);
  finger.begin(FINGER_BAUD);

  Serial.println("Inicializando sensor AS608...");
  if (finger.verifyPassword()) {
    Serial.println("✅ Sensor detectado");
  } else {
    Serial.println("❌ No se detectó el sensor. Revisa cableado/baudrate.");
  }

  // WebServer
  server.on("/", handleRoot);
  server.on("/ping", handlePing);

  // Enrolamiento asíncrono
  server.on("/sensor/enroll/start", handleEnrollStart);
  server.on("/sensor/enroll/status", handleEnrollStatus);
  server.on("/sensor/enroll/cancel", handleEnrollCancel);

  // Enrolamiento sincrónico (útil para Postman)
  server.on("/sensor/enroll", handleEnrollSync);
  server.on("/sensor/delete", handleDelete);
  server.on("/sensor/test", handleFindFinger);
  server.on("/sensor/clean", handleDeleteMemory);

  server.begin();
  Serial.println("HTTP server iniciado en puerto 80");
}

void loop() {
  maintainWiFi();
  server.handleClient();

  // Enrolamiento asíncrono
  tickEnroll();

  // Reconocimiento continuo → POST a tu API
  int id = buscarHuella();
  if (id > 0) {
    Serial.printf("✅ Huella reconocida → slot #%d\n", id);
    unsigned long now = millis();
    if (now - lastPostMs > DEBOUNCE_MS) {
      postAccesoEvento(id); // POST a tu API /acceso/evento
      lastPostMs = now;
    }
    delay(800);
  }

  delay(50);
}
