import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import express from "express";
import cors from "cors";
import axios, {isAxiosError} from "axios";

// Definicja sekretów, których funkcja będzie używać
const gasApiKeySecret = defineSecret("GAS_API_KEY");
const gasUrlSecret = defineSecret("GAS_URL");

const app = express();

// Użyj middleware 'cors' do automatycznej obsługi żądań CORS (w tym OPTIONS)
// To pozwoli Twojej aplikacji Angularowej (nawet z serwera deweloperskiego)
// na bezpieczne komunikowanie się z tą funkcją.
app.use(cors({origin: true}));

// Middleware do parsowania ciała żądania jako JSON
app.use(express.json());

// Definicja endpointu proxy
app.post("/proxy", async (req, res) => {
  const gasApiKey = gasApiKeySecret.value();
  const gasUrl = gasUrlSecret.value();

  logger.info("Odebrano żądanie na /proxy", {body: req.body});

  // Sprawdzenie, czy sekrety są dostępne
  if (!gasUrl || !gasApiKey) {
    logger.error("Brak skonfigurowanych sekretów: GAS_URL lub GAS_API_KEY.");
    res.status(500).json({
      status: "error",
      message: "Błąd konfiguracji serwera po stronie funkcji proxy.",
    });
    return;
  }

  try {
    // Przekazanie żądania do Google Apps Script
    const response = await axios.post(gasUrl, req.body, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": gasApiKey, // Używamy nagłówka oczekiwanego przez GAS
      },
    });

    logger.info("Pomyślnie otrzymano odpowiedź z GAS", {
      status: response.status,
      data: response.data,
    });

    // Odesłanie odpowiedzi z GAS do klienta (Angulara)
    res.status(response.status).json(response.data);
  } catch (error) {
    logger.error("Błąd komunikacji z Google Apps Script:", error);

    // Lepsza obsługa błędów z axios
    if (isAxiosError(error) && error.response) {
      res.status(error.response.status).json({
        status: "error",
        message: "Błąd odpowiedzi z serwera docelowego (GAS)",
        details: error.response.data,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Wewnętrzny błąd serwera proxy.",
      });
    }
  }
});

// Eksportowanie aplikacji Express jako funkcji Firebase
export const api = onRequest({secrets: [gasApiKeySecret, gasUrlSecret]}, app);
