from django.urls import path
from .views import process_video, user_processed_videos

urlpatterns = [
    path('process-video/', process_video, name='process-video'),
    path('user-processed-videos/', user_processed_videos, name='user_processed_videos'),
]