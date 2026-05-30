#!/bin/bash
set -e

if [ "$CF_PAGES_BRANCH" = "capacitor" ]; then
  # Rama capacitor: build con Vite (credenciales via VITE_FIREBASE_* env vars)
  npm ci
  npm run build
  echo "Build Vite completado en dist/"
else
  # Rama dev y otras: build estático tradicional (inyección de credenciales por sed)
  sed \
    -e "s|%%FIREBASE_API_KEY%%|${FIREBASE_API_KEY}|g" \
    -e "s|%%FIREBASE_AUTH_DOMAIN%%|${FIREBASE_AUTH_DOMAIN}|g" \
    -e "s|%%FIREBASE_DATABASE_URL%%|${FIREBASE_DATABASE_URL}|g" \
    -e "s|%%FIREBASE_PROJECT_ID%%|${FIREBASE_PROJECT_ID}|g" \
    -e "s|%%FIREBASE_STORAGE_BUCKET%%|${FIREBASE_STORAGE_BUCKET}|g" \
    -e "s|%%FIREBASE_MESSAGING_SENDER_ID%%|${FIREBASE_MESSAGING_SENDER_ID}|g" \
    -e "s|%%FIREBASE_APP_ID%%|${FIREBASE_APP_ID}|g" \
    js/firebase.example.js > js/firebase.js
  echo "firebase.js generado correctamente"
fi
