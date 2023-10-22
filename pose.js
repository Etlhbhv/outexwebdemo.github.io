let skeleton = false;
let frames = false;

const checkboxs = document.getElementById('toggleSkeleton');
const checkboxf = document.getElementById('toggleFrame');
let framebordersSlider = document.getElementById("framebordersSlider");
let boxcontrolsSlider = document.getElementById("boxcontrolsSlider");
let thicknessSlider = document.getElementById("thicknessSlider");

let framebordersValue = document.getElementById("framebordersValue");
let boxcontrolsValue = document.getElementById("boxcontrolsValue");
let thicknessValue = document.getElementById("thicknessValue");

let frameborders = parseFloat(framebordersSlider.value);
let boxcontrols = parseFloat(boxcontrolsSlider.value);
let thickness = parseFloat(thicknessSlider.value);

boxcontrolsSlider.addEventListener("input", function() {
    boxcontrols = parseFloat(boxcontrolsSlider.value);
    boxcontrolsValue.innerText = boxcontrols;
});

thicknessSlider.addEventListener("input", function() {
    thickness = parseFloat(thicknessSlider.value);
    thicknessValue.innerText = thickness;
});

framebordersSlider.addEventListener("input", function() {
  frameborders = parseFloat(framebordersSlider.value);
  framebordersValue.innerText = frameborders;
});

const can = document.querySelector('.final');
const ctx = can.getContext('2d');
let img = ctx.getImageData(0, 0, can.width, can.height);

const canvas = document.createElement('canvas');
canvas.width = can.width;
canvas.height = can.height;
const canvasCtx = canvas.getContext('2d');

const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
const offscreenCtx = offscreenCanvas.getContext('2d');

const offscreenCanvasm = document.createElement('canvas');
offscreenCanvasm.width = canvas.width;
offscreenCanvasm.height = canvas.height;
const offscreenCtxm = offscreenCanvasm.getContext('2d');

connections = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10]
    , [1, 2], [1, 3], [1, 4], [2, 3], [3, 7], [4, 5], [4, 6], [5, 6], [6, 8], [7, 9]
    , [8, 10], [9, 10], [9, 11], [10, 12], [11, 12], [11, 13], [11, 23], [11, 24], [12, 14], [12, 23]
    , [12, 24], [13, 15], [14, 16], [15, 17], [15, 19], [15, 21], [16, 18], [16, 20], [16, 22], [17, 19]
    , [17, 21], [18, 20], [18, 22], [19, 21], [20, 22], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28]
    , [27, 29], [27, 31], [28, 30], [28, 32], [29, 31], [30, 32]]

function filling(points){
  for (let i = 0; i < points.length; i++){
    if (!points[i]){
      return;
    }
  }
  offscreenCtx.beginPath();
  offscreenCtx.fillStyle = 'white';
  offscreenCtx.moveTo(points[0][0], points[0][1]);
        
  for (let i = 1; i < points.length; i++) {
    offscreenCtx.lineTo(points[i][0], points[i][1]);
  }
        
  offscreenCtx.closePath();
  offscreenCtx.fill();
}

function fillingm(points){
  for (let i = 0; i < points.length; i++){
    if (!points[i]){
      return;
    }
  }
  offscreenCtxm.beginPath();
  offscreenCtxm.fillStyle = 'white';
  offscreenCtxm.moveTo(points[0][0], points[0][1]);
        
  for (let i = 1; i < points.length; i++) {
    offscreenCtxm.lineTo(points[i][0], points[i][1]);
  }
        
  offscreenCtxm.closePath();
  offscreenCtxm.fill();
}

function onResultsPose(results) {
    let xys = [];
    offscreenCtx.save();
    offscreenCtx.fillStyle = "black";
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtxm.save();
    offscreenCtxm.fillStyle = "black";
    offscreenCtxm.fillRect(0, 0, offscreenCanvasm.width, offscreenCanvasm.height);
    if (frames){
    if (results.poseLandmarks) {
      for (let landmark of results.poseLandmarks) {
          xys.push([landmark.x*canvas.width,landmark.y*canvas.height]);
        }
    }

    filling([xys[1], xys[2], xys[3], xys[7],xys[9], xys[10], xys[8], xys[6],xys[5],xys[4]]);
    filling([xys[16], xys[18], xys[20], xys[22]]);
    filling([xys[15], xys[17], xys[19], xys[21]]);
    filling([xys[9], xys[10], xys[12], xys[11]]);
    filling([xys[11],xys[12],xys[24],xys[23]]);
    filling([xys[27], xys[29], xys[31]]);
    filling([xys[28], xys[30], xys[32]]);
    fillingm([xys[1], xys[2], xys[3], xys[7],xys[9], xys[10], xys[8], xys[6],xys[5],xys[4]]);
    fillingm([xys[16], xys[18], xys[20], xys[22]]);
    fillingm([xys[15], xys[17], xys[19], xys[21]]);
    fillingm([xys[9], xys[10], xys[12], xys[11]]);
    fillingm([xys[11],xys[12],xys[24],xys[23]]);
    fillingm([xys[27], xys[29], xys[31]]);
    fillingm([xys[28], xys[30], xys[32]]);

    drawConnectors(offscreenCtx, results.poseLandmarks, connections, {
      color: (data) => {
        return 'white';
      },
      lineWidth: boxcontrols
    });
    drawLandmarks(offscreenCtx, results.poseLandmarks, {
      color: (data) => {
          return 'white';
      },
      lineWidth: 1,
      radius: (data) => {
          return boxcontrols/2;
        }});
    
        drawConnectors(offscreenCtxm, results.poseLandmarks, connections, {
          color: (data) => {
            return 'white';
          },
          lineWidth: boxcontrols-frameborders
        });
        drawLandmarks(offscreenCtxm, results.poseLandmarks, {
          color: (data) => {
              return 'white';
          },
          lineWidth: 1,
          radius: (data) => {
              return (boxcontrols-frameborders)/2;
            }});}

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    if (skeleton){
    drawConnectors(canvasCtx, results.poseLandmarks, connections, {
      color: (data) => {
        return '#00FF00';
      },
      lineWidth: thickness
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: (data) => {
          return '#00FF00';
      },
      lineWidth: 1,
      radius: (data) => {
          return thickness/2;
        }});}
        let imgData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        let imgDatam = offscreenCtxm.getImageData(0, 0, offscreenCanvasm.width, offscreenCanvasm.height);
        let image = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {

          let red = imgData.data[i] - imgDatam.data[i];
          let green = imgData.data[i + 1] - imgDatam.data[i + 1];
          let blue = imgData.data[i + 2] - imgDatam.data[i + 2];
    
          red = Math.min(255, Math.max(0, red));
          green = Math.min(255, Math.max(0, green));
          blue = Math.min(255, Math.max(0, blue));
    
          img.data[i] = red + image.data[i];
          img.data[i + 1] = green + image.data[i + 1];
          img.data[i + 2] = blue + image.data[i + 2];
          img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);

      offscreenCtx.restore(); 
      offscreenCtxm.restore(); 
    canvasCtx.restore();
}
const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
    }
});

pose.onResults(onResultsPose);

const hiddenVideo = document.createElement('video');

const camera = new Camera(hiddenVideo, {
  onFrame: async () => {
      try {
          await pose.send({ image: hiddenVideo });
      } catch (error) {
          console.error("Pose detection error:", error);
      }
  },
  width: 480,
  height: 480
});

pose.onResults((results) => {;
  onResultsPose(results);
});


hiddenVideo.onloadedmetadata = () => {
  if (hiddenVideo.readyState === hiddenVideo.HAVE_ENOUGH_DATA) {
      hiddenVideo.play();
  }
};
pose.initialize().then(() => {
  console.log("Model and assets have been loaded and initialized.");
  
  camera.start().then(() => {
    console.log("Camera started");
  }).catch(error => {
    console.error("Camera initialization failed:", error);
  });
}).catch((error) => {
  console.error("Model initialization failed:", error);
});

checkboxs.addEventListener('change', function() {
  if (this.checked) {
  skeleton = true;}
  else{
    skeleton = false;
  }
})

checkboxf.addEventListener('change', function() {
  if (this.checked) {
  frames = true;}
  else{
    frames = false;
  }
})