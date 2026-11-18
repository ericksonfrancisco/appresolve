import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Faz a notificação aparecer na tela mesmo com o app em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function dispararNotificacaoLocal(titulo: string, mensagem: string) {
  // Na Web, a API nativa de push local do Expo não funciona sem Service Worker,
  // então usamos a Notification API do próprio navegador como fallback:
  if (Platform.OS === 'web') {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(titulo, { body: mensagem });
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(titulo, { body: mensagem });
        }
      }
    }
    return;
  }

  // No Android / iOS: verifica e solicita permissão
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permissão de notificação negada.');
    return;
  }

  // Canal obrigatório no Android 8+
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notificações ResoLve',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // Dispara o push local imediatamente
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      sound: true,
    },
    trigger: null, // null = dispara na hora
  });
}