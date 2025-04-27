import rootImage from '../../../assets/images/chakras/c1.png';
import sacralImage from '../../../assets/images/chakras/c2.png';
import solarImage from '../../../assets/images/chakras/c3.png';
import heartImage from '../../../assets/images/chakras/c4.png';

import rootAudio from '../../../assets/audio/root-chakra.mp3';
import sacralAudio from '../../../assets/audio/sacral-chakra.mp3';
import solarAudio from '../../../assets/audio/solar-plexus.mp3';
import heartAudio from '../../../assets/audio/heart-chakra.mp3';

import rootMantra from '../../../assets/audio/root-bij-mantra.mp3';
import sacralMantra from '../../../assets/audio/sacral-bij-mantra.mp3';
import solarMantra from '../../../assets/audio/solar-plexus-bij-mantra.mp3';
import heartMantra from '../../../assets/audio/heart-bij-mantra.mp3';

// Yoga pose images (example paths — adjust if needed)
import mountainPose from '../../../assets/images/yoga/mountain.png';
import warrior1 from '../../../assets/images/yoga/warrior1.png';
import garland from '../../../assets/images/yoga/garland.png';

import boundAngle from '../../../assets/images/yoga/bound-angle.png';
import goddessPose from '../../../assets/images/yoga/godess.png';
import seatedForwardBend from '../../../assets/images/yoga/seated-forward.png';

import boatPose from '../../../assets/images/yoga/boat.png';
import warrior3 from '../../../assets/images/yoga/warrior3.png';
import bowPose from '../../../assets/images/yoga/bow.png';

import camelPose from '../../../assets/images/yoga/camel.png';
import cobraPose from '../../../assets/images/yoga/cobra.png';
import bridgePose from '../../../assets/images/yoga/bridge.png';

const chakraData = [
  {
    id: "root",
    name: "Root Chakra",
    color: "#b30000",
    image: rootImage,
    affirmationAudio: rootAudio,
    mantraAudio: rootMantra,
    mantra: "LAM",
    tips: "Focus on grounding. Imagine roots growing from your feet.",
    yogaPoses: [
      { name: "Mountain Pose", image: mountainPose, duration: 30 },
      { name: "Warrior I", image: warrior1, duration: 45 },
      { name: "Garland Pose", image: garland, duration: 40 },
    ],
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    color: "#e65c00",
    image: sacralImage,
    affirmationAudio: sacralAudio,
    mantraAudio: sacralMantra,
    mantra: "VAM",
    tips: "Embrace creativity and flow. Visualize water energy.",
    yogaPoses: [
      { name: "Bound Angle", image: boundAngle, duration: 40 },
      { name: "Goddess", image: goddessPose, duration: 30 },
      { name: "Seated Forward Bend", image: seatedForwardBend, duration: 45 },
    ],
  },
  {
    id: "solar",
    name: "Solar Plexus Chakra",
    color: "#ffd700",
    image: solarImage,
    affirmationAudio: solarAudio,
    mantraAudio: solarMantra,
    mantra: "RAM",
    tips: "Visualize a glowing sun in your belly. Feel your personal power.",
    yogaPoses: [
      { name: "Boat Pose", image: boatPose, duration: 30 },
      { name: "Warrior III", image: warrior3, duration: 40 },
      { name: "Bow Pose", image: bowPose, duration: 45 },
    ],
  },
  {
    id: "heart",
    name: "Heart Chakra",
    color: "#009933",
    image: heartImage,
    affirmationAudio: heartAudio,
    mantraAudio: heartMantra,
    mantra: "YAM",
    tips: "Breathe into your chest. Feel love and compassion expand.",
    yogaPoses: [
      { name: "Camel Pose", image: camelPose, duration: 40 },
      { name: "Cobra", image: cobraPose, duration: 30 },
      { name: "Bridge", image: bridgePose, duration: 45 },
    ],
  },
];

export default chakraData;
