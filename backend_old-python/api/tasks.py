import threading
import time
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .algorithm import AntAlgorithm


algorithm_instance = None
algorithm_thread = None

def start_algorithm_task():
    global algorithm_instance, algorithm_thread

    # Jeśli algorytm już działa, zatrzymaj go
    if algorithm_instance and algorithm_instance._running:
        stop_algorithm_task()

    algorithm_instance = AntAlgorithm()
    algorithm_thread = threading.Thread(target=algorithm_instance.start)
    algorithm_thread.start()

def stop_algorithm_task():
    global algorithm_instance, algorithm_thread

    if algorithm_instance:
        algorithm_instance.stop()
    if algorithm_thread:
        algorithm_thread.join()


# Only for test
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

# Only for test
def start_background_task():
    thread = threading.Thread(target=send_delayed_notification)
    thread.start()
