from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ProcessedVideo
from rest_framework.decorators import api_view
import os
from .visualize import process
from django.core.files.uploadedfile import TemporaryUploadedFile
from rest_framework import status
from django.conf import settings
import shutil


@api_view(['POST'])
@csrf_exempt
def process_video(request):
    if request.method == 'POST' and request.FILES.get('videofile'): 
        video_file = request.FILES['videofile']
        
        # Define the temporary folder path
        temp_folder = os.path.join(settings.BASE_DIR, 'videoProcessor', 'temp_folder')
        
        if not os.path.exists(temp_folder):
            os.makedirs(temp_folder)
            
        video_file_path = os.path.join(temp_folder, video_file.name)
        with open(video_file_path, 'wb') as destination:
            for chunk in video_file.chunks():
                destination.write(chunk)
        
        # Now you have the path to the uploaded video file
        # print("Video file path:", video_file_path)
        
        # Process the video file 
        info = process(video_file_path)
        
        processed_video = ProcessedVideo.objects.create(
            video_title = video_file.name, 
            duration = info.get('duration'),
            emotional_tone = info.get('emotional_tone'),
            engagement_score = info.get('engagement_score'),
            pareto = info.get('pareto'),
            axvspan = info.get('axvspan'),
        )
        
        # Clear the temporary folder after processing the video
        shutil.rmtree(temp_folder)
            
        return JsonResponse({'info': info, 'message': 'Video processed successfully'})
    else:
        return JsonResponse({'error': 'No video file provided'}, status=status.HTTP_400_BAD_REQUEST)
        