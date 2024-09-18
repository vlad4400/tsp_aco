from django.urls import path
from .views import StartAlgorithm, StopAlgorithm, hello_world, TriggerNotification
from . import consumers


urlpatterns = [
    path('ws/algorithm/', consumers.AlgorithmConsumer.as_asgi()),
    path('start-algorithm/', StartAlgorithm.as_view(), name='start_algorithm'),
    path('stop-algorithm/', StopAlgorithm.as_view(), name='stop_algorithm'),
    
    # Only for test
    path('hello/', hello_world, name='hello_world'),
    path('trigger-notification/', TriggerNotification.as_view(), name='trigger_notification'),
]
