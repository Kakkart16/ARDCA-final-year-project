import subprocess
import os
import cv2
import numpy as np
from keras.models import load_model
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
import io
import base64


current_directory = os.path.dirname(os.path.realpath(__file__))

color_map = {0: 'red', 1: 'green', 2: 'purple', 3: 'orange', 4: 'grey', 5: 'blue', 6: 'yellow'}
labels_dict = {0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy', 4: 'Neutral', 5: 'Sad', 6: 'Surprise'}


def read_images_sorted(directory):
  images = []
  # Get filenames sorted in ascending order
  filenames = sorted(os.listdir(directory))
  for filename in filenames:
    # Check if it's an image file
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
      # Construct the full path
      filepath = os.path.join(directory, filename)
      # Read the image with cv2
      image = cv2.imread(filepath)
      if image is not None:
        images.append(image)
  return images


def plotAxvspan(raw_test_results):
    
    plt.figure(figsize=(8, 2))
    plt.xlabel("Time (sec)")
    plt.title("Timeseries plot of emotion classes")

    # Set y-axis limits (assuming values don't go beyond 0 and 1)
    plt.ylim(0, 1)

    # Starting time (adjust if needed)
    start_time = 0

    # Loop through the data and create axvspan rectangles
    for value in raw_test_results:
        end_time = start_time + 1  # Assuming each value represents a unit of time
        plt.axvspan(start_time, end_time, color=color_map[value], alpha=1)  # Adjust alpha for transparency
        start_time = end_time

    # plt.grid(True)  # Add gridlines
    legend_elements = [Patch(facecolor=color,label=labels_dict[idx]) for idx,color in color_map.items()]

    plt.legend(handles=legend_elements, bbox_to_anchor = (1.25, 0.6), loc='center left')
    plt.tight_layout()
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='jpg')
    buffer.seek(0)
    plot_data = buffer.getvalue()
    
    # plt.close()

    # Encode the plot data as base64
    axvspan = base64.b64encode(plot_data).decode('utf-8')
    
    return axvspan


def plotPareto(data):
    sorted_data = dict(sorted(data.items(), key=lambda item: item[1], reverse=True))
    # Calculate cumulative frequencies and total frequency
    total = sum(sorted_data.values())
    cumulative_percentage = 0
    cumulative_frequencies = []
    for value in sorted_data.values():
        cumulative_percentage += (value / total) * 100
        cumulative_frequencies.append(cumulative_percentage)

    # Create the Pareto chart
    fig,ax1 = plt.subplots()

    ax1.bar(sorted_data.keys(), sorted_data.values(), color='b')
    ax1.set_xlabel('Categories')
    ax1.set_ylabel('Frequency')

    plt.title('Pareto Distribution')
    plt.xticks(ha='center')
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='jpg')
    buffer.seek(0)
    plot_data = buffer.getvalue()

    # Close the plot to release resources
    # plt.close()
    pareto = base64.b64encode(plot_data).decode('utf-8')
    return pareto


def process(video_file_path):

    # print(video_file_path)
        
    # Path to ffmpeg.exe
    ffmpeg_path = os.path.join(current_directory, 'Utilities', 'ffmpeg.exe')
    output_path = os.path.join(current_directory, 'Output', 'output_%04d.png')

    # ----- Final Query Execution -----
    query = f'"{ffmpeg_path}" -i "{video_file_path}" -vf fps=1 -loglevel quiet -stats "{output_path}"'
    subprocess.run(query, shell=True)
    
    # ----- Process Frames -----
    directory = os.path.join(current_directory, 'Output')
    images = read_images_sorted(directory)

    model_path = os.path.join(current_directory, 'model_file.h5')
    
    model = load_model(model_path)
    
    x_path = os.path.join(current_directory, 'haarcascade_frontalface_default.xml')
    print(x_path)
        
    faceDetect = cv2.CascadeClassifier(x_path)

    
    raw_test_results = []

    if images:
        # Processing Frames
        for image in images:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = faceDetect.detectMultiScale(gray, 1.3, 3)
            for x, y, w, h in faces:
                sub_face_img = gray[y:y+h, x:x+w]
                resized = cv2.resize(sub_face_img, (48, 48))
                normalize = resized/255.0
                reshaped = np.reshape(normalize, (1, 48, 48, 1))
                result = model.predict(reshaped)
                label = np.argmax(result, axis=1)[0]
                raw_test_results.append(label)
    else:
        print("No images found in the directory!")
        

    duration_in_seconds = len(images)

    # ----- Remove Temporary Files -----
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        os.remove(file_path)

    
    plot1 = plotAxvspan(raw_test_results)     

    
    frequency_count = dict()
    for cls in labels_dict.values():
       frequency_count[cls] = 0
    for cls in raw_test_results:
       frequency_count[labels_dict[cls]]+=1
       
    sorted_data = dict(sorted(frequency_count.items(), key=lambda item: item[1], reverse=True))
   
    plot2 = plotPareto(frequency_count)
    

    info = {
       "duration": duration_in_seconds,
       "emotional_tone": list(sorted_data.keys())[:3],
       "engagement_score": round((duration_in_seconds-sorted_data["Neutral"])/duration_in_seconds,2),
       "pareto": plot2,
       "axvspan": plot1,
    #    "time_stamp": datetime.datetime.now(),
    }
    
    return info
