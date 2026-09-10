const int pinoSensorLM35 = A0;
float temperatura;

void setup() {
  Serial.begin(9600);
}

  void loop() {
  int valorLido = analogRead(pinoSensorLM35);
  temperatura = (valorLido * 0.00488);
  temperatura = temperatura * 100;

  // para declarar labels no plotter serial:
  Serial.print("TempMaximo:");
  Serial.print(4);
  Serial.print(" ");
  Serial.print("Temperatura:");
  Serial.print(temperatura - 21);
  Serial.print(" ");
  Serial.print("TempMinimo:");
  Serial.println(0);

  delay(1000);
}

