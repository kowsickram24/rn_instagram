import notifee, { AndroidImportance } from '@notifee/react-native';

export const Notifeeconfig = async () => {
    await notifee.requestPermission();
    await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });
};
