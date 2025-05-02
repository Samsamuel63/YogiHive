import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam'
// import { count } from '../../utils/music';
import { count } from '../../../../utils/music';

import Instructions from '../../../../components/Instrctions/Instructions';


// import DropDown from '../../../components/DropDown/DropDown';
// import { poseImages } from '../../utils/pose_images';
import { poseImages } from '../../../../utils/pose_images';
// import { POINTS, keypointConnections } from '../../utils/data';
import { POINTS, keypointConnections } from '../../../../utils/data';
// import { drawPoint, drawSegment } from '../../utils/helper'
import { drawPoint, drawSegment } from '../../../../utils/helper';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { useRef, useEffect } from 'react'



let skeletonColor = 'rgb(255,255,255)'
let poseList = [
  'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog',
  'Shoulderstand', 'Traingle'
]

let interval

// flag variable is used to help capture the time when AI just detect 
// the pose as correct(probability more than threshold)
let flag = false


export default function Level8() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);  // Timer state
  const [isGameOver, setIsGameOver] = useState(false);

  // Start the timer when the component mounts
  React.useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup timer on component unmount
    } else {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  const handleFinishLevel = () => {
    // Redirect to the next level or any other action
    navigate('/hard/level/9');
  };

  const webcamRef = useRef(null)
  const canvasRef = useRef(null)


  const [startingTime, setStartingTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [poseTime, setPoseTime] = useState(0)
  const [bestPerform, setBestPerform] = useState(0)
  const [currentPose, setCurrentPose] = useState('SuptaVirasana')
  const [isStartPose, setIsStartPose] = useState(false)


  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000
    if (flag) {
      setPoseTime(timeDiff)
    }
    if ((currentTime - startingTime) / 1000 > bestPerform) {
      setBestPerform(timeDiff)
    }
  }, [currentTime])


  useEffect(() => {
    setCurrentTime(0)
    setPoseTime(0)
    setBestPerform(0)
  }, [currentPose])

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
  }

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1)
    let right = tf.gather(landmarks, right_bodypart, 1)
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
    return center

  }

  function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER)
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center_new = tf.expandDims(pose_center_new, 1)

    pose_center_new = tf.broadcastTo(pose_center_new,
      [1, 17, 2]
    )
    // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
    let max_dist = tf.max(tf.norm(d, 'euclidean', 0))

    // normalize scale
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
    return pose_size
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center = tf.expandDims(pose_center, 1)
    pose_center = tf.broadcastTo(pose_center,
      [1, 17, 2]
    )
    landmarks = tf.sub(landmarks, pose_center)

    let pose_size = get_pose_size(landmarks)
    landmarks = tf.div(landmarks, pose_size)
    return landmarks
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))
    let embedding = tf.reshape(landmarks, [1, 34])
    return embedding
  }

  const runMovenet = async () => {
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json')
    const countAudio = new Audio(count)
    countAudio.loop = true
    interval = setInterval(() => {
      detectPose(detector, poseClassifier, countAudio)
    }, 100)
  }

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0
      const video = webcamRef.current.video
      const pose = await detector.estimatePoses(video)
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)')
              let connections = keypointConnections[keypoint.name]
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                    [keypoints[POINTS[conName]].x,
                    keypoints[POINTS[conName]].y]
                    , skeletonColor)
                })
              } catch (err) {

              }

            }
          } else {
            notDetected += 1
          }
          return [keypoint.x, keypoint.y]
        })
        if (notDetected > 4) {
          skeletonColor = 'rgb(255, 255, 255)'
          return
        }
        const processedInput = landmarks_to_embedding(input)
        const classification = poseClassifier.predict(processedInput)

        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose]
          console.log(data[0][classNo])
          if (data[0][classNo] > 0.97) {

            if (!flag) {
              countAudio.play()
              setStartingTime(new Date(Date()).getTime())
              flag = true
            }
            setCurrentTime(new Date(Date()).getTime())
            skeletonColor = 'rgb(0,255,0)'
          } else {
            flag = false
            skeletonColor = 'rgb(21, 255, 0)'
            countAudio.pause()
            countAudio.currentTime = 0
          }

          // Redirect to Level 9 when skeleton color is 'rgb(0,255,0)'
          if (skeletonColor === 'rgb(0,255,0)') {
            navigate('/hard/level/9'); // Redirect to Level 9
          }
        })
      } catch (err) {
        console.log(err)
      }


    }
  }

  function startYoga() {
    setIsStartPose(true)
    runMovenet()
  }

  function stopPose() {
    setIsStartPose(false)
    clearInterval(interval)
  }



  if (isStartPose) {
    return (
      <div
        style={{
          margin: '0 auto',
          padding: '40px',
          background: 'linear-gradient(to right, #312e81, #1e3a8a)',
          minHeight: '100vh',
        }}
      >
        {/* Header Section */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
              margin: 0,
            }}
          >
            Level 8: Yoga Challenge
          </h1>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '500',
              color: '#a5b4fc',
              marginTop: '16px',
            }}
          >
            Time Left: {timeLeft} seconds
          </h2>
        </header>

        {/* Instruction, Button & Pose Image Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          {/* Instruction and Button */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            {!isGameOver ? (
              <>
                <p
                  style={{
                    fontSize: '1.25rem',
                    color: '#e5e7eb',
                    marginBottom: '16px',
                  }}
                >
                  Follow the on-screen instructions to complete the challenge!
                </p>
                <button
                  onClick={handleFinishLevel}
                  style={{
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '9999px',
                    fontSize: '1.25rem',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    width: '200px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
                >
                  Finish Level
                </button>
              </>
            ) : (
              <>
                <h2
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#dc2626',
                    marginBottom: '16px',
                  }}
                >
                  Game Over!
                </h2>
                <p
                  style={{
                    fontSize: '1.25rem',
                    color: '#f3f4f6',
                    marginBottom: '16px',
                  }}
                >
                  Time&apos;s up! You can try again or move to the next level.
                </p>
                <button
                  onClick={() => navigate('/hard')}
                  style={{
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    width: '200px',
                    borderRadius: '9999px',
                    fontSize: '1.25rem',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
                >
                  Back to Levels
                </button>
              </>
            )}
          </div>

          {/* Pose Image */}
          <div style={{ flexShrink: 0 }}>
            <img
              src={poseImages[currentPose]}
              alt="Yoga Pose"
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #818cf8',
                width: '144px',
                height: '144px',
              }}
            />
          </div>
        </div>

        {/* Content Section: Webcam and Canvas Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {/* Webcam Section */}
          <Webcam
            width={640}
            height={480}
            id="webcam"
            ref={webcamRef}
            style={{
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          />

          {/* Canvas Frame Section */}
          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              border: '4px solid #818cf8',
              width: '640px',
              height: '480px',
            }}
          >
            <canvas
              ref={canvasRef}
              id="my-canvas"
              width={640}
              height={480}
              style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <h2
                style={{
                  fontSize: '1.5rem',
                  color: 'white',
                  fontWeight: '700',
                }}
              >
                RESULT
              </h2>
            </div>
          </div>
        </div>
      </div>


    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "12px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#3b4c63",
        height: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "16px", color: "#fff", textAlign: "center" }}>
        Current Pose: <span style={{ fontWeight: "bold", color: "#fff" }}>{currentPose}</span>
      </h2>

      <div style={{ marginBottom: "24px" }}>
        <Instructions currentPose={currentPose} />
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={startYoga}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "rgb(255, 0, 93)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#00b453")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00b453")}
        >
          Start Pose
        </button>
      </div>
    </div>

  );
}
