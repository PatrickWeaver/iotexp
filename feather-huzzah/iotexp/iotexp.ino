#include <ESP8266WiFi.h>

const char *ssid     = "yourssid";
const char *password = "yourpassword";
const char *host = "iotexp.glitch.me";
const String togglePath = "/toggle";
const String statusPath = "/status";
int lightStatus = 0;
int count = 0;

void checkLight(int lightStatus) {
  if (lightStatus == 1) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
}

int requestLight(String path) {
  Serial.print("\nConnecting to ");
  Serial.print(host);
  Serial.println(path);

  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 80;
  
  if (!client.connect(host, httpPort)) {
    Serial.println("\nConnection failed.");
    return -1;
  }
  
  // This will send the request to the server
  client.print(String("GET ") + path + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
  delay(100);
  
  // Read all the lines of the reply from server and print them to Serial
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
    char *sta = "status";
    if (line.substring(3, 9) == sta) {
      if (line.substring(11, 15) == "true") {
        Serial.println("\nTURNING ON");
        return 1;
      } else {
        Serial.println("\nTURNING OFF");
        return 0;
      }
    }
  }
  Serial.println("\nClosing connection\n\n");
  delay(500);
  return -1;  
}


void setup() {
  pinMode(15, OUTPUT);
  pinMode(13, OUTPUT);
  pinMode(2, INPUT_PULLUP);
  Serial.begin(9600);
  delay(100);

  // We start by connecting to a WiFi network
  char *s;
  Serial.print("Connecting to: ");
  Serial.println(ssid);
    
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (count == 500) {
    digitalWrite(15, HIGH);
    count = 0;
    lightStatus = requestLight(statusPath);
    digitalWrite(15, LOW);
  }

  
  checkLight(lightStatus);
  int buttonStatus = digitalRead(2);
  if (!buttonStatus) { // buttonStatus is true when NOT pressed
    lightStatus = (lightStatus * -1) + 1;
    checkLight(lightStatus);
    digitalWrite(15, HIGH);
    lightStatus = requestLight(togglePath);
    digitalWrite(15, LOW);
  }

  
  //Serial.println("Local button status: ");
  //Serial.println(buttonStatus);
  //Serial.println("Local light status: ");
  //Serial.println(lightStatus);
  //Serial.println("");
  count++;
  delay(10);
}
