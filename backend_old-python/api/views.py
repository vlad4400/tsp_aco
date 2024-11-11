from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .tasks import start_algorithm_task, stop_algorithm_task
import logging

# For tests
@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})

# For tests
class TriggerNotification(APIView):
    def post(self, request):
        channel_layer = get_channel_layer()
        message = {'message': request.data.get('message', 'Hello from backend')}
        async_to_sync(channel_layer.group_send)(
            'notifications',
            {
                'type': 'send_notification',
                'message': message,
            }
        )
        return Response({'status': 'Message sent'})

class StartAlgorithm(APIView):
    def post(self, request):
        logging.info("Starting algorithm [1]")
        start_algorithm_task()
        return Response({'status': 'Algorithm started'}, status=status.HTTP_200_OK)

class StopAlgorithm(APIView):
    def post(self, request):
        logging.info("Stopping algorithm [1]")
        stop_algorithm_task()
        return Response({'status': 'Algorithm stopped'}, status=status.HTTP_200_OK)
