from django.db import models

class ProcessedVideo(models.Model):
    video_title = models.CharField(max_length=100)
    duration = models.FloatField()
    emotional_tone = models.CharField(max_length=100)
    engagement_score = models.FloatField()
    pareto = models.ImageField()
    axvspan = models.ImageField()