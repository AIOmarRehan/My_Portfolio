// Tech icon mappings for react-icons
// Reference: https://react-icons.github.io/react-icons/

export interface IconData {
  icon: string // e.g., "fa/FaPython"
  color?: string
  label?: string
}

export const techIcons: Record<string, IconData> = {
  // Languages
  python: { icon: 'fa/FaPython', label: 'Python' },
  javascript: { icon: 'io5/IoLogoJavascript', color: '#f7df1e', label: 'JavaScript' },
  typescript: { icon: 'si/SiTypescript', color: '#3178c6', label: 'TypeScript' },
  java: { icon: 'fa/FaJava', color: '#007396', label: 'Java' },
  cpp: { icon: 'tb/TbBrandCpp', color: '#00599c', label: 'C++' },
  csharp: { icon: 'tb/TbBrandCSharp', color: '#239120', label: 'C#' },
  golang: { icon: 'fa6/FaGolang', color: '#00add8', label: 'Go' },
  rust: { icon: 'fa/FaRust', color: '#ce422b', label: 'Rust' },
  dart: { icon: 'fa6/FaDartLang', color: '#0175c2', label: 'Dart' },
  kotlin: { icon: 'si/SiKotlin', color: '#7f52ff', label: 'Kotlin' },
  swift: { icon: 'fa/FaSwift', color: '#fa7343', label: 'Swift' },
  bash: { icon: 'si/SiGnubash', label: 'Bash' },
  shell: { icon: 'vsc/VscTerminalPowershell', label: 'Shell' },
  r: { icon: 'fa/FaRProject', color: '#276dc3', label: 'R' },
  php: { icon: 'fa/FaPhp', color: '#777bb4', label: 'PHP' },
  c: { icon: 'si/SiC', color: '#5C6BC0', label: 'C' },
  flutter: { icon: 'fa6/FaFlutter', color: '#3FC4FF', label: 'Flutter' },

  // Frameworks & Libraries
  react: { icon: 'fa/FaReact', color: '#61dafb', label: 'React' },
  vue: { icon: 'fa/FaVuejs', color: '#4fc08d', label: 'Vue.js' },
  vuejs: { icon: 'fa/FaVuejs', color: '#4fc08d', label: 'Vue.js' },
  angular: { icon: 'fa/FaAngular', color: '#dd0031', label: 'Angular' },
  nextjs: { icon: 'ri/RiNextjsFill', label: 'Next.js' },
  nodejs: { icon: 'fa/FaNodeJs', color: '#68a063', label: 'Node.js' },
  express: { icon: 'si/SiExpress', color: '#999999', label: 'Express' },
  django: { icon: 'si/SiDjango', color: '#092e20', label: 'Django' },
  flask: { icon: 'si/SiFlask', color: '#000000', label: 'Flask' },
  fastapi: { icon: 'si/SiFastapi', color: '#0D9B8E', label: 'FastAPI' },
  chartjs: { icon: 'si/SiChartdotjs', color: '#FF6384', label: 'Chart.js' },

  // AI/ML Libraries
  tensorflow: { icon: 'si/SiTensorflow', color: '#ff6f00', label: 'TensorFlow' },
  pytorch: { icon: 'si/SiPytorch', color: '#ee4c2c', label: 'PyTorch' },
  keras: { icon: 'si/SiKeras', color: '#D10808', label: 'Keras' },
  // scikit: { icon: 'si/SiScikitlearn', color: '#f7931e', label: 'Scikit-learn' },
  pandas: { icon: 'si/SiPandas', color: '#150458', label: 'Pandas' },
  numpy: { icon: 'si/SiNumpy', color: '#08AFC4', label: 'NumPy' },
  opencv: { icon: 'si/SiOpencv', label: 'OpenCV' },
  llama: { icon: 'si/SiOllama', label: 'LLaMA' },

  // Cloud Platforms
  aws: { icon: 'fa/FaAws', color: '#ff9900', label: 'AWS' },
  gcp: { icon: 'si/SiGooglecloud', color: '#4285f4', label: 'Google Cloud' },
  google: { icon: 'fa/FaGoogle', color: '#4285f4', label: 'Google' },
  azure: { icon: 'vsc/VscAzure', color: '#0078d4', label: 'Azure' },
  microsoft: { icon: 'fa/FaMicrosoft', color: '#0078d4', label: 'Microsoft' },
  vercel: { icon: 'io5/IoLogoVercel', label: 'Vercel' },
  netlify: { icon: 'bi/BiLogoNetlify', color: '#00c7b7', label: 'Netlify' },
  heroku: { icon: 'di/DiHeroku', color: '#430098', label: 'Heroku' },
  colab: { icon: 'si/SiGooglecolab', color: '#f9ab00', label: 'Google Colab' },

  // Databases & Backend
  sql: { icon: 'tb/TbSql', color: '#336791', label: 'SQL' },
  mongodb: { icon: 'di/DiMongodb', color: '#13aa52', label: 'MongoDB' },
  postgresql: { icon: 'si/SiPostgresql', color: '#336791', label: 'PostgreSQL' },
  redis: { icon: 'di/DiRedis', color: '#dc382d', label: 'Redis' },
  firebase: { icon: 'si/SiFirebase', color: '#ffa400', label: 'Firebase' },
  supabase: { icon: 'ri/RiSupabaseFill', color: '#3ecf8e', label: 'Supabase' },
  elasticsearch: { icon: 'si/SiElasticsearch', color: '#005571', label: 'Elasticsearch' },
  mysql: { icon: 'si/SiMysql', color: '#4479a1', label: 'MySQL' },

  // DevOps & Tools
  docker: { icon: 'fa/FaDocker', color: '#2496ed', label: 'Docker' },
  kubernetes: { icon: 'ai/AiOutlineKubernetes', color: '#326ce5', label: 'Kubernetes' },
  git: { icon: 'fa6/FaGitAlt', color: '#f1502f', label: 'Git' },
  github: { icon: 'fa/FaGithub', color: '#151B22', label: 'GitHub' },
  vite: { icon: 'tb/TbBrandVite', color: '#646cff', label: 'Vite' },

  // Frontend
  html: { icon: 'fa/FaHtml5', color: '#e34f26', label: 'HTML' },
  css: { icon: 'fa/FaCss3Alt', color: '#1572b6', label: 'CSS' },
  // tailwind: { icon: 'si/SiTailwindcss', color: '#06b6d4', label: 'Tailwind CSS' },
  bootstrap: { icon: 'fa/FaBootstrap', color: '#7952b3', label: 'Bootstrap' },

  // APIs & Protocols
  graphql: { icon: 'gr/GrGraphQl', color: '#e10098', label: 'GraphQL' },
  rest: { icon: 'ci/CiLink', color: '#009688', label: 'REST API' },
  api: { icon: 'ai/AiFillApi', label: 'API' },
  zapier: { icon: 'tb/TbBrandZapier', color: '#FF5008', label: 'Zapier' },
  n8n : { icon: 'si/SiN8N', color: '#EB5175', label: 'n8n' },

  // ML/AI Fields
  machinelearning: { icon: 'lia/LiaBrainSolid', label: 'Machine Learning' },
  deeplearning: { icon: 'gi/GiBrain', label: 'Deep Learning' },
  nlp: { icon: 'lu/LuLanguages', color: '#4285f4', label: 'NLP' },
  cv: { icon: 'fa/FaEye', label: 'Computer Vision' },
  ai: { icon: 'fa/FaBrain', label: 'AI' },
  ml: { icon: 'fa/FaRobot', label: 'ML' },

  // Other
  linux: { icon: 'fa/FaLinux', label: 'Linux' },
  windows: { icon: 'fa/FaWindows', color: '#0078d4', label: 'Windows' },
  macos: { icon: 'si/SiMacos', label: 'macOS' },

  // Brand platforms
  huggingface: { icon: 'si/SiHuggingface', color: '#ffd700', label: 'Hugging Face' },
  medium: { icon: 'fa/FaMedium', color: '#000000', label: 'Medium' },

  // Hardware & Embedded
  arduino: { icon: 'si/SiArduino', color: '#00979D', label: 'Arduino' },
  raspberrypi: { icon: 'si/SiRaspberrypi', color: '#c51a4a', label: 'Raspberry Pi' },
  nvidia: { icon: 'si/SiNvidia', color: '#76b900', label: 'NVIDIA' },
  robots: { icon: 'lia/LiaRobotSolid', label: 'Robots' },
  robotics: { icon: 'lia/LiaRobotSolid', label: 'Robotics' },
  agriculture: { icon: 'md/MdAgriculture', color: '#7CFC00', label: 'Agriculture' },
  
  // Custom SVGs from /public/svg-icons/
  gradio: { icon: 'svg/gradio', color: '#FF7C00', label: 'Gradio' },
  antigravity: { icon: 'svg/antigravity-color', label: 'Antigravity' },
  tailwindcss: { icon: 'svg/tailwind-css', color: '#00BCFF', label: 'Tailwind CSS' },
  animalclss: { icon: 'svg/Animal-Class', label: 'Animal Classification' },
  audioclss: { icon: 'svg/audio-class', label: 'Audio Classification' },
  audiopre: { icon: 'svg/audio-preprocess', label: 'Audio Preprocessing' },
  binaryclss: { icon: 'svg/binary-classification', label: 'Binary Classification' },
  imageclss: { icon: 'svg/classification-image', label: 'Image Classification' },
  cnn: { icon: 'svg/CNN', label: 'CNN' },
  modelcomp: { icon: 'svg/comparison', label: 'Model Comparison' },
  datacln: { icon: 'svg/data-cleaning', label: 'Data Cleaning' },
  edgecomp: { icon: 'svg/edge-computing', label: 'Edge Computing' },
  embedded: { icon: 'svg/emb', label: 'Embedded Systems' },
  financialmngt: { icon: 'svg/Financial-management', label: 'finance-management' },
  financetrk: { icon: 'svg/Financial-tracker', label: 'financetracker' },
  gradcam: { icon: 'svg/gradcam', label: 'Grad CAM' },
  imgdenoise: { icon: 'svg/image-denoising', label: 'Image Denoising' },
  imgpreprocess: { icon: 'svg/Image-Preprocessing', label: 'Image Preprocessing' },
  iot: { icon: 'svg/IoT1', label: 'IoT' },
  is: { icon: 'svg/IS', label: 'Information System' },
  melspec: { icon: 'svg/melspectro', label: 'Mel spectrograms' },
  mri: { icon: 'svg/mri', label: 'MRI Images' },
  oop: { icon: 'svg/OOP', label: 'OOP' },
  prplmsolv: { icon: 'svg/problem-solving', label: 'Problem Solving' },
  scikitlearn: { icon: 'svg/Scikit_Learn', label: 'Scikit-learn' },
  yolo: { icon: 'svg/yolo-logo', color: '#0B22A9', label: 'YOLO' },
  soft: { icon: 'svg/deal-svgrepo-com', label: 'Soft Skills' },
  datapre: { icon: 'svg/data-processing', label: 'Data Preprocessing' },
  eda: { icon: 'svg/exploratory-analysis', label: 'EDA' },
  audiodenoise: { icon: 'svg/auddenoise', label: 'Audio Denoising' },
  audioclean: { icon: 'svg/audio-cleaning', label: 'Audio Cleaning' },
  qwen: {icon: 'svg/Qwen_logo', label: 'Qwen'},

  // Other
  balls: { icon: 'lia/LiaVolleyballBallSolid', label: 'Balls Classification' },
  tumor: { icon: 'gi/GiTumor', color: '#ff0000', label: 'Brain Tumors' },
}

const normalizeTag = (tagName: string): string => {
  const normalized = tagName.toLowerCase().trim()
  const aliasMap: Record<string, string> = {
    'c++': 'cpp',
    'c plus plus': 'cpp',
    'c#': 'csharp',
    'c sharp': 'csharp',
    'node.js': 'nodejs',
    'node js': 'nodejs',
    'next.js': 'nextjs',
    'next js': 'nextjs',
    'vue.js': 'vuejs',
    'react.js': 'react',
    'google cloud': 'gcp',
    'googlecloud': 'gcp',
    'google colab': 'colab',
    'googlecolab': 'colab',
    'machine learning': 'machinelearning',
    'deep learning': 'deeplearning',
    'computer vision': 'cv',
    'information system': 'is',
    'image denoising': 'imgdenoise',
    'audio classification': 'audioclss',
    'mel spectrograms': 'melspec',
    'audio preprocessing': 'audiopre',
    'mri images': 'mri',
    'brain tumors': 'tumor',
    'image classification': 'imageclss',
    'animal classification': 'animalclss',
    'binary classification': 'binaryclss',
    'balls classification': 'balls',
    'model comparison': 'modelcomp',
    'finance-management': 'financialmngt',
    'financetracker': 'financetrk',
    'finance tracker': 'financetrk',
    'financial management': 'financialmngt',
    'financial tracker': 'financetrk',
    'data cleaning': 'datacln',
    'audio denoising': 'audiodenoise',
    'edge computing': 'edgecomp',
    'embedded systems': 'embedded',
    'image preprocessing': 'imgpreprocess',
    'problem solving': 'prplmsolv',
    'scikit-learn': 'scikitlearn',
    'scikit learn': 'scikitlearn',
    'grad cam': 'gradcam',
    'raspberry pi': 'raspberrypi',
    'soft skills': 'soft',
    'data preprocessing':'datapre',
    'audio denoise': 'audiodenoise',
    'audio cleaning': 'audioclean',
  }

  if (aliasMap[normalized]) {
    return aliasMap[normalized]
  }

  return normalized.replace(/[\s.-]+/g, '')
}

export function getTagIcon(tagName: string): IconData | null {
  const normalized = normalizeTag(tagName)
  return techIcons[normalized] || null
}

export function getAllTags(): string[] {
  return Object.keys(techIcons)
}