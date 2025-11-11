import LetterGlitch from './RComponents/LetterGlitch'; 
import Waves from './RComponents/Waves';
import Balatro from './RComponents/Balatro';



const DoorRegistry = [
  {
    component: Balatro,
    props: {
      isRotate: false,
      mouseInteraction: true,
      pixelFilter: 700
    }
  },
  {
    component: LetterGlitch,
    props: {
      glitchSpeed: 50,
      centerVignette: true,
      outerVignette: false,
      smooth: true
    }
  },
  {
    component: Waves,
    props: {
      lineColor: "#fff",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      waveSpeedX: 0.02,
      waveSpeedY: 0.01,
      waveAmpX: 40,
      waveAmpY: 20,
      friction: 0.9,
      tension: 0.01,
      maxCursorMove: 120,
      xGap: 12,
      yGap: 36
    }
  }
];

export default DoorRegistry;