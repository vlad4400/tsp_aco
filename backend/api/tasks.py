import threading
import time
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def send_delayed_notification():
    time.sleep(10)  # Czekaj 10 sekund
    channel_layer = get_channel_layer()
    message = "Test message #2"
    async_to_sync(channel_layer.group_send)(
        'notifications',
        {
            'type': 'send_notification',
            'message': message,
        }
    )
    print("Wiadomość wysłana po 10 sekundach")

def start_background_task():
    thread = threading.Thread(target=send_delayed_notification)
    thread.start()
