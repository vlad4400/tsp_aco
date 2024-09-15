from django.urls import path
from .views import hello_world, TriggerNotification

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('trigger-notification/', TriggerNotification.as_view(), name='trigger_notification'),
]
