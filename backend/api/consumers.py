# api/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging

logger = logging.getLogger(__name__)

class AlgorithmConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add('algorithm_updates', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('algorithm_updates', self.channel_name)

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event['message']))


# Only for test
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Dołącz do grupy 'notifications'
        logger.info(f"Klient {self.channel_name} dołączył do grupy 'notifications'")
        await self.channel_layer.group_add('notifications', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Opuść grupę 'notifications'
        logger.info(f"Klient {self.channel_name} opuścił grupę 'notifications'")
        await self.channel_layer.group_discard('notifications', self.channel_name)

    # Obsługa wiadomości wysyłanych przez klienta
    async def receive(self, text_data):
        data = json.loads(text_data)
        logger.info(f"Odebrano wiadomość od klienta: {data}")
        print(f"Odebrano wiadomość od klienta: {data}")

        # Możesz przetworzyć wiadomość tutaj
        # Na przykład, odsyłając ją do grupy 'notifications'
        await self.channel_layer.group_send(
            'notifications',
            {
                'type': 'send_notification',
                'message': data
            }
        )

    # Metoda do wysyłania wiadomości do klienta
    async def send_notification(self, event):
        logger.info(f"Wysyłanie wiadomości do klienta: {event['message']}")
        message = event['message']
        await self.send(text_data=json.dumps(message))
