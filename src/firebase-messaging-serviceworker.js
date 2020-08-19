importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


firebase.initializeApp({
  'messagingSenderId': '635273605558'
});

const messaging = firebase.messaging();

/*
 * 1.- incluir este archivo en el angular.json / seccion "assets"
 * 2.- en el manifest añadir: "gc_sender_id": "103953800507",
 * 3.- crear el archivo y metodos de notificaciones en MessagingService (services\messaging.service.ts)
 * 
 */