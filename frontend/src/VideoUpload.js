import React, { useState } from 'react';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Navbar from './Navbar';
import backgroundImage from './assets/bgimage.jpg';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('video', selectedFile);
    console.log(formData);
    fetch('api', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        
      })
      .catch(error => { 
        console.log(error,"Unable to Upload File.");
      });
  };

  return (
    <div className='h-screen flex flex-col'>
      <Navbar/>
      <div className='p-0 m-0 flex flex-row h-screen justify-center items-center'>
          <div className='w-1/2 h-full'>
            <img className='bg-cover bg-center p-10 mt-10' src={backgroundImage} alt="" />
          </div>

          <div className='w-1/2 h-full flex justify-center items-center flex-col rounded-sm ='>

              <h1 className='text-xl text-gray-900 my-2 font-semibold'>Upload your video</h1>

              <div className='w-1/2 flex justify-center flex-col bg-gray-200 items-center rounded-lg p-14 border-black border-2 border-dashed'>
                  <CloudUploadIcon style={{ color: 'black', fontSize: 40 }}/>
                  <p className='text-gray-900'>Drag & Drop video file here </p>
                  <p className='text-gray-900 text-lg font-bold p-2'> or </p>
                  <input className='text-gray-900 pl-20' type="file" onChange={handleFileChange} />
              </div>

              <button className='bg-sky-800 hover:bg-sky-900 rounded-lg text-gray-100 text-lg shadow-lg w-40 p-2 mt-2' onClick={handleUpload}>Submit</button>

          </div>
      </div>
    </div>
  );
}

export default FileUpload;