import threading
import time

import logging

class AntAlgorithm:
    def __init__(self):
        self._running = False

    def start(self):
        logging.info("Uruchamianie algorytmu mrówkowego")
        
        self._running = True
        while self._running:
            # Implementacja algorytmu mrówkowego
            # To jest uproszczony przykład
            # Zamiast time.sleep, wstaw logikę algorytmu
            time.sleep(1)
            # Wysyłaj aktualizacje stanu
            self.send_update()

    def stop(self):
        self._running = False

    def send_update(self):
        from asgiref.sync import async_to_sync
        from channels.layers import get_channel_layer

        channel_layer = get_channel_layer()
        
        
        logging.info("Podtrzymywanie aktualizacji algorytmu")
        
        async_to_sync(channel_layer.group_send)(
        'notifications',
            {
                'type': 'send_notification',
                'message': 'Aktualny stan algorytmu',
            }
        )
        
        async_to_sync(channel_layer.group_send)(
            'algorithm_updates',
            {
                'type': 'send_update',
                'message': 'Aktualny stan algorytmu',
            }
        )
