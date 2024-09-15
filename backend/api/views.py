from django.shortcuts import render

# Create your views here.

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})