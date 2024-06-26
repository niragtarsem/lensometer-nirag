import { useEffect, useRef, useState } from 'react';
import {BaseUrl} from '@/components/constants';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { message} from 'antd';
import Swal from 'sweetalert2';
import '@/styles/camera.css';
import '@/styles/videocamera.css';
import Voice from '@/components/voice';
import ProgressBar from '@/components/ProgressBar';
const CameraComponent = () => {
  const videoRef = useRef();
  const [imageData, setImageData] = useState(true);
  const [messagecamera, setmessagecamera] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popupCompleted, setPopupCompleted] = useState(true);
  const router = useRouter();
  const instructions = [
    { text: "Please maintain 50 cm distance of camera from screen glass.", duration: 5 },
    { text: "Please maintain 25 cm distance of glass from screen and 50 cm distance of camera from the screen.", duration: 5 },
    { text: "Please maintain 25 cm distance of right glass from screen and 50 cm distance of camera from screen.", duration: 5 }
  ];
  const[addinstructions, setaddinstructionDone] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(instructions[currentIndex].duration);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const [cylDone, setcylDone] = useState(false);
  const [testtype, settesttype] = useState('cyl');
  const [counterlimit, setcounterlimit] = useState(1);
  const [usercameramegapixel, setusercameramegapixel] = useState(0);
  const [lenscapure, setlenscapure] = useState(false); // Initial zoom level
  const [voicecontent, setvoicecontent] = useState('camera_screen_cyl'); // Initial zoom level
  const [remainingTime, setRemainingTime] = useState(10);
  const [errormessage, seterrormessage] = useState(false);
  const [flagvalue, setflagvalue] = useState(false);
  const [aligndistance, setaligndistance] = useState(false);
  const [mobiledistance, setmobiledistance] = useState(0);
  const [glassdistance, setglassdistance] = useState(0);
  const [hasHandledRed, setHasHandledRed] = useState(false);
  const [leftstatus, setleftstatus] = useState(false);
  const [rightstatus, setrightstatus] = useState(false);
  const [withoutglassstatus, setwithoutglassstatus] = useState(false);
  const [lensometer, setlensometer] = useState(false);
  const [calculatedetect, setcalculatedetect] = useState(false);
  const [secondtime, setsecondtime] = useState(false);
  const [mobilewidth, setmobilewidth] = useState(0);
  const [mobiledistancecorrect, setmobiledistancecorrect] = useState(false);
  const [glassdistancecorrect, setglassdistancecorrect] = useState(false);
  const [mobiledistancecorrectred, setmobiledistancecorrectred] = useState(false);
  const [glassdistancecorrectred, setglassdistancecorrectred] = useState(false);
  useEffect(() => {
    if(popupCompleted){
      const interval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            setCurrentIndex(prevIndex => {
              const nextIndex = (prevIndex + 1) % instructions.length;
              if (nextIndex === 0) {
                setAllStepsCompleted(true); // All steps completed
                clearInterval(interval); // Stop the countdown
              }
              return nextIndex;
            });
            return instructions[currentIndex].duration;
          }
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
    
  }, [countdown, currentIndex, allStepsCompleted, addinstructions, popupCompleted, cylDone]);



 

useEffect(() => {
  const adjustMobileWidth = () => {
      if (!glassdistance) {
          let newWidth;

          if (mobiledistance >= 48 && mobiledistance <= 52) {
              newWidth = 20;
              setmobiledistancecorrect(true);
              setmobiledistancecorrectred(false)
          } else if (mobiledistance > 52) {
            setmobiledistancecorrect(false);
            setmobiledistancecorrectred(false)
              if (mobiledistance > 90) {
                  newWidth = 3 - (mobiledistance - 90) * 1.25;
              } else if (mobiledistance > 80) {
                  newWidth = 4 - (mobiledistance - 80) * 1.25;
              } else if (mobiledistance > 70) {
                  newWidth = 5 - (mobiledistance - 70) * 1.25;
              } else if (mobiledistance > 60) {
                  newWidth = 6 - (mobiledistance - 60) * 1.25;
              } else {
                  newWidth = 7 - (mobiledistance - 52) * 1.25;
              }
          } else if (mobiledistance < 48) {
            setmobiledistancecorrectred(true)
            setmobiledistancecorrect(false);
              if (mobiledistance <= 22) {
                  newWidth = 36 + (22 - mobiledistance) * 1.25;
              }else if (mobiledistance <= 31) {
                newWidth = 32 + (31 - mobiledistance) * 1.25;
            } else if (mobiledistance <= 34) {
                  newWidth = 30 + (34 - mobiledistance) * 1.25;
              } else if (mobiledistance <= 42) {
                  newWidth = 27 + (42 - mobiledistance) * 1.25;
              }else if (mobiledistance <= 45) {
                newWidth = 25 + (45 - mobiledistance) * 1.25;
            } else {
                  newWidth = 19 + (48 - mobiledistance) * 1.25;
              }
          }

          // Increment the newWidth by 1.45
          newWidth += 1.45;

          setmobilewidth(newWidth);
      }
  };
  const adjustglassWidth = () => {
    if (!mobiledistance) {
        let newWidth;
        if (glassdistance >= 23 && glassdistance <= 28) {
            setglassdistancecorrect(true)
            setglassdistancecorrectred(false)
            newWidth = 58;
        } else if (glassdistance >= 29) {
          setglassdistancecorrect(false)
          setglassdistancecorrectred(false)
            if (glassdistance >= 40) {
                newWidth = 48 - (glassdistance - 40) * 1.25;
            } else if (glassdistance >= 35) {
                newWidth = 45 - (glassdistance - 35) * 1.25;
            } else {
                newWidth = 38 - (glassdistance - 28) * 1.25;
            }
        } else if (glassdistance < 23) {
            setglassdistancecorrect(false)
            setglassdistancecorrectred(true)
            if (glassdistance < 10) {
                newWidth = 80 + (10 - glassdistance) * 1.25;
            } else if (glassdistance <= 16) {
                newWidth = 75 + (16 - glassdistance) * 1.25;
            } else {
                newWidth = 65 + (23 - glassdistance) * 1.25;
            }
        }

        // Increment the newWidth by 1.45
        newWidth += 1.45;

        setmobilewidth(newWidth);
    }
};

  adjustMobileWidth();
  adjustglassWidth();
}, [mobiledistance, glassdistance]);


  useEffect(() => {
    
    const openCamera = async () => {
      if(popupCompleted){
        try {
          // Get the user's camera stream
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment',width: { min: 320, max: 20000 },
          height: { min: 240, max: 20000 },aspectRatio: 1.777777778,
          frameRate: {min:10, max: 15 },}, advanced: [{ zoom: 1 }], focusMode: 'continuous' });
          // Set the camera stream as the source for the video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          const videoTrack = stream.getVideoTracks()[0];
          
          // Check if getCapabilities is supported
          if ('getCapabilities' in videoTrack) {
            const capabilities = videoTrack.getCapabilities();
            const widthRange = capabilities.width;
            const heightRange = capabilities.height;
            const maxMegapixels = (widthRange.max * heightRange.max) / 1000000;
            setusercameramegapixel(maxMegapixels)
          } else {
            console.warn('Camera resolution capabilities are not supported in this browser/device.');
          }

          setInterval(captureImage, 600); // Capture image every 1 second

          // if(usercameramegapixel){
          //   setInterval(captureImage, 500); // Capture image every 1 second
          // }
          
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      }
    };

    openCamera();
    var popupTimeout = ''
    if(!popupCompleted){
      setmessagecamera('')
      popupTimeout = setTimeout(() => {
        Swal.fire({
          title: '<span class="custom-title">Instruction</span>',
          text: 'Align your phone in front of your desktop screen for accurate readings.',
          timer: 3000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false, // Hide the OK button
        }).then(() => {
          setPopupCompleted(true); // Mark popup as completed when it's closed
        });
      }, 100);
    }

    // Clean up the camera stream when the component unmounts
    return () => {
      if(!popupCompleted){
        clearTimeout(popupTimeout);
      }
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, [popupCompleted]);



  const captureImage = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const quality = isiPhone() ? 0.6 : 0.9;
  
      // Convert the canvas to Blob object
      canvas.toBlob((blob) => {
        if (blob) {
          // Create FormData object
          const formData = new FormData();
          // Append the Blob object to FormData
          formData.append('frameData', blob, 'image.jpg');
  
          // Send the FormData to the backend
          //sendImageToBackend(formData);
          sendImageToBackendcalculate(formData);
        }
      }, 'image/jpeg', quality);
    }
  };

  const isiPhone = () => {
    return /iPhone/i.test(navigator.userAgent);
  };

  

  const isiPhonePro = () => {
    const userAgent = navigator.userAgent;
    return /iPhone.*Pro/i.test(userAgent);
  };


  const sendImageToBackendcalculate = (imageBlob) => {
    if (imageBlob) {
      
      const authToken = localStorage.getItem("business_access_token");
      const Business_Url = localStorage.getItem("BusinessBaseurl");
      const config = {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      };
      const isIPhonePro = isiPhonePro(); // Check if the device is an iPhone Pro
      imageBlob.append('mega_pixel', usercameramegapixel)
      imageBlob.append('i_phone_pro', isIPhonePro ? 'yes' : 'no');
      axios.post(`${Business_Url}/calculate-screen-distance/`, imageBlob, config)
        .then(response => {
          if(response.data.status==200){

            setaligndistance(true)
            if(response.data.status==200 && response.data.message==='Your camera is not align properly'){
              setaligndistance(false)
              seterrormessage(true)
              setmessagecamera(response.data.message)
            }

            if (response.data.distance_glass >= 18 && response.data.distance_glass <= 32) {
              if(response.data.processing_status==true){
                setLoading(true)
                setcalculatedetect(true)
              }
            }

            


            if(response.data.distance_mobile){
              setglassdistance(0)
              if(response.data.distance_mobile >= 48 || response.data.distance_mobile <= 52){
                if(!hasHandledRed){
                  setTimeout(function() {
                    setvoicecontent('put_glass_data')
                }, 3000); // 2000 milliseconds = 2 seconds
                  setHasHandledRed(true);
                }
                
              }
              setmobiledistance(response.data.distance_mobile)
            }else if(response.data.distance_glass){
              setmobiledistance(0)
              setglassdistance(response.data.distance_glass)
            }
          }else if(response.data.status==400 ){
            setmessagecamera('')
          }
            
        })
        .catch(error => {
          console.log(error,'here>>>>>>>>>')
        });
    }
  };


  


  useEffect(() => {
    if (imageData && !calculatedetect) {
      //sendImageToBackend()
      sendImageToBackendcalculate()
    }
  }, [imageData, calculatedetect]);

  useEffect(() => {
    if (loading) {
      if (videoRef.current) {
        setsecondtime(true)
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());

        } else {
          console.log("No stream found.");
        }
      } else {
        console.log("Video ref not found.");
      }
    }
  }, [loading]);
  

  

  useEffect(() => {
    if (lenscapure) {
      Swal.fire({
        title: '<span class="custom-title">Instruction</span>',
        text: 'Your camera or eyeglass is not clear please clean it and test again.',
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false, // Hide the OK button
      }).then(() => {
        localStorage.removeItem('business_access_token');
        localStorage.removeItem('business_access_refresh');
        router.push('/login/')
      });
    }
  }, [lenscapure, Swal]);


  useEffect(() => {
     if(popupCompleted){
      const interval = setInterval(() => {
        setRemainingTime(prevTime => {
          const newTime = prevTime - 1;
          return newTime < 1 ? 0 : newTime; // If newTime is less than 1, set it to 0
        });
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
     }
      
    
  }, [popupCompleted, remainingTime]);
  

  const fetchfinalreport = async () => {
    if(!lensometer){
      const authToken = localStorage.getItem("business_access_token");
      const Business_Url = localStorage.getItem("BusinessBaseurl");
      const config = {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      };
    try {
      const result = await axios.post(`${Business_Url}/calculate-final-report/`,{}, config);
      setvoicecontent('test_completed')
      if (result.data.message == 'Test Completed' && result.data.status==200) {
        setlensometer(true)
        seterrormessage(false)
        setmessagecamera('Test Completed')
        setTimeout(function() {
          router.push('/report/')
      }, 3000);
      }else if(result.data.message !== 'Test Completed'){
        setTimeout(function() {
          setlenscapure(true)
      }, 10000); // 15 seconds = 15,000 milliseconds
        
      }
    } catch (error) {
      console.log(error, 'hereeee');
    }
    }
    
  };

  useEffect(() => {
    if(loading && !lensometer){
        const intervalId = setInterval(() => {
          fetchfinalreport();
        }, 2000);
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }
    

  }, [loading, lensometer, glassdistance]);



  


  return (
    <>
    {!mobiledistancecorrect && !glassdistance && !mobiledistance && !loading ? (
     <div className="logo-wrap gif-wrap">
        <a href="#"><img src="/images/mobile_images/logo.png" alt="Logo" /></a>
    </div>
     ) : ""}
    <div className="inner-div videocamera">
    
     </div>
     <div className='video-processing-camera'>
     {!loading && popupCompleted ? (
     <h5>Camera steps Instruction</h5>
    ) : ""}
    {!mobiledistancecorrect && !glassdistance && mobiledistance && popupCompleted && !loading ? (
    <div className="gifwrapp">
      <img src="/images/mobile_images/1st_gif.gif"/>
    </div>
    ) : ""}
     {mobiledistancecorrect && !loading ? (
    <div className="gifwrapp">
      <img src="/images/mobile_images/2nd_gif.gif"/>
    </div>
    ) : ""}
    <div className='camera-wrapp'>
      {/*<Voice text={voicecontent}/>*/}
      <div className='camera-spiner'><Spin spinning={loading} tip="Loading..."/></div>
      <div className='good-wrap'>
      {loading === false && !errormessage && ( messagecamera==='Test Completed') ? (
        messagecamera && (
          <p className='mb-0'>Test Completed 👍 </p>
        )
        ): (popupCompleted!==false && errormessage===true && messagecamera && !aligndistance && !loading) ? (
          messagecamera && (<p className='error-req mb-0'>
            {messagecamera}
          </p>)
        ):(
        ""
        )}
      </div>
     

      {!glassdistance && mobiledistance && !loading ? (
        <>
          <div className="distance-wrap text-center">
          <div className="inner-distance">
            <img src="/images/mobile_images/distance-equal-1.png" alt="" />
            <div className="mobile-movewrap"  style={{ left: mobiledistancecorrect ? '19%': `${mobilewidth}%` }}>
              <div className="inner-move-mob">
              
              {mobiledistancecorrect ? (
                <div className='greenwarp'>
                  <img src="/images/mobile_images/mobile-move-green.png" alt="" />
                  <span className="text-span">50cm</span>
                </div>
              ) : mobiledistancecorrectred ? (
                <>
                  <img src="/images/mobile_images/mobile-move-red.png" alt="" />
                  <span className="text-span">{mobiledistance}cm</span>
                </>
              ) : (
                <>
                  <img src="/images/mobile_images/mobile-move.png" alt="" />
                  <span className="text-span">{mobiledistance}cm</span>
                </>
              )}
              
              </div>
            </div>
          </div>
          </div>
          {/* <ProgressBar progress={mobiledistance} /> */}
          <p className='mobile-distance-text'>Mobile Distance: {mobiledistance} CM</p>
        </>
      ) : ""}
      {!mobiledistance && glassdistance && !loading ? (
        <>
          <div className="distance-wrap text-center">
          <div className="inner-distance">
            <img src="/images/mobile_images/distance-equal-1.png" alt="" />
            <div className="mobile-movewrap"  style={{ left: glassdistancecorrect ? '56%': `${mobilewidth}%` }}>
              <div className="inner-move-mob">
              
              {glassdistancecorrect ? (
                                    <div className='greenwarp'>
                                        <img src="/images/mobile_images/mobile-move-green.png" alt="" />
                                        <span className='text-span'>25cm</span>
                                    </div>
                                ) : glassdistancecorrectred ? (
                                  <>
                                    <img src="/images/mobile_images/mobile-move-red.png" alt="" />
                                    <span className="text-span">{glassdistance}cm</span>
                                  </>
                                ): (
                                    <>
                                        <img src="/images/mobile_images/mobile-move.png" alt="" />
                                        <span className='text-span'>{glassdistance}cm</span>
                                    </>
                                )}
              
              </div>
            </div>
          </div>
          </div>
          {/* <ProgressBar progressglass={glassdistance} /> */}
          <p className='mobile-distance-text'>Glass Distance: {glassdistance} CM</p>
        </>
      ):""}

{loading && <div className='fetching-report-pending-message'>
        <h2>
        Please wait we are Fetching your Report...
        </h2>
        </div>}

        {popupCompleted === true && !secondtime && <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />}
    </div>
     </div>
    
    
     
    </>
  );
};

export default CameraComponent;
