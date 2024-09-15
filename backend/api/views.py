from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.views import APIView
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})

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
