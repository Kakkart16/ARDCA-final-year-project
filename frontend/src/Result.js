import React , { useRef } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Result = ({ dur, emotion, engagementScore, pareto, axvspan, videoFile }) => {
  const axvsapnImage = `data:image/jpeg;base64,${axvspan}`;
  const paretoImage = `data:image/jpeg;base64,${pareto}`;
  const resultRef = useRef(null);

  const downloadPDF = (imageData, fileName) => {
    const pdf = new jsPDF();
    const imgWidth = videoFile.width;
    const imgHeight = videoFile.height;

    pdf.addImage(imageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
  };

  const downloadReport = () => {
    html2canvas(resultRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Use imgData in downloadPDF
      downloadPDF(imgData, 'report.pdf');
    });
  };

  return (
    <div className='h-full flex flex-row'>
      
      <div className=' w-1/2 p-4 flex flex-col'>

        <div className='p-4'>
          <video controls className="rounded-sm border-2 border-sky-900 p-1 bg-sky-900" style={{ width: '100%', marginBottom: '8px' }}>
            <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className='flex flex-col border-2 p-4 w-full'>
          <div className='flex p-2'>
            <PlayCircleIcon style={{ color: 'rgb(12, 74, 110)', fontSize: 25, }}/> 
            <span className='text-lg font-mono px-2 font-semibold'>Total Playtime: </span>
            <span className='text-lg font-mono px-2'>{dur}</span>
          </div>

          <div className='flex p-2'>
            <AddReactionIcon style={{ color: 'rgb(12, 74, 110)', fontSize: 25, }}/>
            <p className="text-lg font-mono px-2 font-semibold">Engagement Score: </p>
            <p className='text-lg font-mono px-2'> {engagementScore}</p>
          </div>

          <div className='flex p-2'>
            <EmojiEmotionsIcon style={{ color: 'rgb(12, 74, 110)', fontSize: 25, }}/>
            <p className="text-lg font-mono font-semibold px-2">Emotion:</p>
            {emotion.map((emote, index) => (
              <p className='font-mono px-2 text-lg' key={index}> | {emote} | </p>
            ))}
          </div>

          <button onClick={downloadReport} className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Download Report as PDF
      </button>

        </div>
      </div>

      <div className='h-full p-4 flex flex-col'>
        <div className='border-2 border-gray-300 pb-4 px-4 m-4  items-center'>
            <div className='flex flex-row justify-between items-center'>
              <p className='text-base text-gray-900 font-semibold  py-1'>Time-wise Analysis</p>
              <div className='p-1'>
                <button onClick={() => downloadPDF(axvsapnImage, 'axvsapnImage')} className="flex justify-center items-center text-sm bg-sky-700 hover:bg-sky-900 text-white p-1 rounded"> 
                  <FileDownloadOutlinedIcon style={{fontSize:15,}}/> <span className='px-1'>Download</span>
                </button>
              </div>
            </div>

            <div className='border-2 p-2'>
              <img src={axvsapnImage} alt="" />
            </div>
          
        </div>

        <div className='border-2 border-gray-300 pb-4 px-4 m-4 items-center'>
            <div className='flex flex-row justify-between items-center'>
              <p className='text-base text-gray-900 font-semibold  py-1'>Overall Emotion Analysis</p>
              <div className='p-1'>
                <button onClick={() => downloadPDF(paretoImage, 'paretoImage')} className="flex justify-center items-center text-sm bg-sky-700 hover:bg-sky-900 text-white p-1 rounded"> 
                  <FileDownloadOutlinedIcon style={{fontSize:15,}}/>  <span className='px-1'>Download</span>
                </button>
              </div>
            </div>
          <div className='border-2 p-2'>
            <img src={paretoImage} alt="" />
          </div>
          
          </div> 
      </div>

    </div>
  )
}

export default Result