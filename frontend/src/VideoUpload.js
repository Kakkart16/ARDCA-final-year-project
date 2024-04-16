import React, { useState } from 'react';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Navbar from './Navbar';
import Result from './Result';
import backgroundImage from './assets/bgimage.jpg';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BufferingIcon from './assets/buffering.gif';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dur, setDur] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [engagementScore, setEngagementScore] = useState(null);
  const [pareto, setPareto] = useState(null);
  const [axvspan, setAxvspan] = useState(null);
  const [loading, setLoading] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    setLoading(1);
    const formData = new FormData();
    formData.append('videofile', selectedFile);
    console.log(formData);
    fetch('http://127.0.0.1:8000/process-video/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        setLoading(2);
        setDur(response.info.duration); 
        setEmotion(response.info.emotional_tone); 
        setEngagementScore(response.info.engagement_score);
        setPareto(response.info.pareto)
        setAxvspan(response.info.axvspan)
        console.log(response.info);
      })
      .catch(error => {
        setLoading(0);
        console.log(error, "Unable to Upload File.");
      });
  };

  return (
    <div className='h-screen'>
      <Navbar/>
      <div className='relative'>
      {loading===1 && (
        <div className="fixed left-0 w-full h-full z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          {/* <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-gray-200"></div> */}
          <div aria-label="Loading..." role="status" class="flex items-center space-x-2">
            <svg class="h-20 w-20 animate-spin stroke-white" viewBox="0 0 256 256">
                <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="24"></line>
                <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                </line>
                <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="24"></line>
                <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                </line>
                <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="24"></line>
                <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                </line>
            </svg>
            <span class="text-4xl font-medium text-gray-200">Loading...</span>
          </div>
        </div> 
      )}

      {loading===2 && (
        <Result dur={dur} emotion={emotion} engagementScore={engagementScore} pareto={pareto} axvspan={axvspan} videoFile={selectedFile}/>
      )}

      {(loading===0 || loading===1) && (
      <div className={`flex flex-row h-full justify-center items-center ${(loading===1) ? 'blur' : ''}`}>

        <div className='w-1/2'>
          <img className='bg-cover bg-center p-10 mt-10' src={backgroundImage} alt="" />
        </div>
      
        <div className='w-1/2 h-full flex flex-col justify-center items-center rounded-sm'>

          <h1 className='text-xl text-gray-900 my-2 font-semibold'>Upload your video</h1>

          <div className='w-1/2 flex justify-center flex-col bg-gray-200 items-center rounded-lg p-14 border-black border-2 border-dashed'>
            <CloudUploadIcon style={{ color: 'black', fontSize: 40 }} />
            <p className='text-gray-900'>Drag & Drop video file here </p>
            <p className='text-gray-900 text-lg font-bold p-2'> or </p>
            <input className='text-gray-900 pl-20' type="file" onChange={handleFileChange} />
          </div>

          <button className='bg-sky-800 hover:bg-sky-900 rounded-lg text-gray-100 text-lg shadow-lg w-40 p-2 mt-2' onClick={handleUpload}>Submit</button>

        </div>

      </div>)}
      </div>
    </div>
  );
}

export default FileUpload;
