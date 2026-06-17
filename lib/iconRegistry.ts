import type { IconType } from 'react-icons'

/**
 * Tree-shakeable icon registry.
 *
 * Previously TagBadge / TagSearchInput did `import * as FaIcons from
 * 'react-icons/fa'` for ~15 packages — that pulls in THOUSANDS of icons and is
 * the single biggest dev-compile + bundle cost. Here we import only the
 * specific named icons referenced by techIcons.ts, so the bundler keeps just
 * those. Keyed by the same "pkg/Name" string used in techIcons.
 */
import {
  FaPython, FaJava, FaRust, FaSwift, FaRProject, FaPhp, FaReact, FaVuejs,
  FaAngular, FaNodeJs, FaAws, FaGoogle, FaMicrosoft, FaDocker, FaGithub,
  FaHtml5, FaCss3Alt, FaBootstrap, FaEye, FaBrain, FaRobot, FaLinux,
  FaWindows, FaMedium,
} from 'react-icons/fa'
import { FaGolang, FaDartLang, FaFlutter, FaGitAlt } from 'react-icons/fa6'
import {
  SiTypescript, SiKotlin, SiGnubash, SiC, SiExpress, SiDjango, SiFlask,
  SiFastapi, SiChartdotjs, SiTensorflow, SiPytorch, SiKeras, SiPandas,
  SiNumpy, SiOpencv, SiOllama, SiGooglecloud, SiGooglecolab, SiPostgresql,
  SiFirebase, SiElasticsearch, SiMysql, SiN8N, SiMacos, SiHuggingface,
  SiArduino, SiRaspberrypi, SiNvidia,
} from 'react-icons/si'
import { IoLogoJavascript, IoLogoVercel, IoLogoTableau } from 'react-icons/io5'
import { TbBrandCpp, TbBrandCSharp, TbSql, TbBrandVite, TbBrandZapier } from 'react-icons/tb'
import { VscTerminalPowershell, VscAzure } from 'react-icons/vsc'
import { RiNextjsFill, RiSupabaseFill } from 'react-icons/ri'
import { BiLogoNetlify } from 'react-icons/bi'
import { DiHeroku, DiMongodb, DiRedis } from 'react-icons/di'
import { AiOutlineKubernetes, AiFillApi } from 'react-icons/ai'
import { GrGraphQl } from 'react-icons/gr'
import { CiLink } from 'react-icons/ci'
import { LiaBrainSolid, LiaRobotSolid, LiaVolleyballBallSolid } from 'react-icons/lia'
import { GiBrain, GiTumor } from 'react-icons/gi'
import { LuLanguages } from 'react-icons/lu'
import { MdAgriculture } from 'react-icons/md'

export const iconRegistry: Record<string, IconType> = {
  'fa/FaPython': FaPython,
  'fa/FaJava': FaJava,
  'fa/FaRust': FaRust,
  'fa/FaSwift': FaSwift,
  'fa/FaRProject': FaRProject,
  'fa/FaPhp': FaPhp,
  'fa/FaReact': FaReact,
  'fa/FaVuejs': FaVuejs,
  'fa/FaAngular': FaAngular,
  'fa/FaNodeJs': FaNodeJs,
  'fa/FaAws': FaAws,
  'fa/FaGoogle': FaGoogle,
  'fa/FaMicrosoft': FaMicrosoft,
  'fa/FaDocker': FaDocker,
  'fa/FaGithub': FaGithub,
  'fa/FaHtml5': FaHtml5,
  'fa/FaCss3Alt': FaCss3Alt,
  'fa/FaBootstrap': FaBootstrap,
  'fa/FaEye': FaEye,
  'fa/FaBrain': FaBrain,
  'fa/FaRobot': FaRobot,
  'fa/FaLinux': FaLinux,
  'fa/FaWindows': FaWindows,
  'fa/FaMedium': FaMedium,
  'fa6/FaGolang': FaGolang,
  'fa6/FaDartLang': FaDartLang,
  'fa6/FaFlutter': FaFlutter,
  'fa6/FaGitAlt': FaGitAlt,
  'si/SiTypescript': SiTypescript,
  'si/SiKotlin': SiKotlin,
  'si/SiGnubash': SiGnubash,
  'si/SiC': SiC,
  'si/SiExpress': SiExpress,
  'si/SiDjango': SiDjango,
  'si/SiFlask': SiFlask,
  'si/SiFastapi': SiFastapi,
  'si/SiChartdotjs': SiChartdotjs,
  'si/SiTensorflow': SiTensorflow,
  'si/SiPytorch': SiPytorch,
  'si/SiKeras': SiKeras,
  'si/SiPandas': SiPandas,
  'si/SiNumpy': SiNumpy,
  'si/SiOpencv': SiOpencv,
  'si/SiOllama': SiOllama,
  'si/SiGooglecloud': SiGooglecloud,
  'si/SiGooglecolab': SiGooglecolab,
  'si/SiPostgresql': SiPostgresql,
  'si/SiFirebase': SiFirebase,
  'si/SiElasticsearch': SiElasticsearch,
  'si/SiMysql': SiMysql,
  'si/SiN8N': SiN8N,
  'si/SiMacos': SiMacos,
  'si/SiHuggingface': SiHuggingface,
  'si/SiArduino': SiArduino,
  'si/SiRaspberrypi': SiRaspberrypi,
  'si/SiNvidia': SiNvidia,
  'io5/IoLogoJavascript': IoLogoJavascript,
  'io5/IoLogoVercel': IoLogoVercel,
  'io5/IoLogoTableau': IoLogoTableau,
  'tb/TbBrandCpp': TbBrandCpp,
  'tb/TbBrandCSharp': TbBrandCSharp,
  'tb/TbSql': TbSql,
  'tb/TbBrandVite': TbBrandVite,
  'tb/TbBrandZapier': TbBrandZapier,
  'vsc/VscTerminalPowershell': VscTerminalPowershell,
  'vsc/VscAzure': VscAzure,
  'ri/RiNextjsFill': RiNextjsFill,
  'ri/RiSupabaseFill': RiSupabaseFill,
  'bi/BiLogoNetlify': BiLogoNetlify,
  'di/DiHeroku': DiHeroku,
  'di/DiMongodb': DiMongodb,
  'di/DiRedis': DiRedis,
  'ai/AiOutlineKubernetes': AiOutlineKubernetes,
  'ai/AiFillApi': AiFillApi,
  'gr/GrGraphQl': GrGraphQl,
  'ci/CiLink': CiLink,
  'lia/LiaBrainSolid': LiaBrainSolid,
  'lia/LiaRobotSolid': LiaRobotSolid,
  'lia/LiaVolleyballBallSolid': LiaVolleyballBallSolid,
  'gi/GiBrain': GiBrain,
  'gi/GiTumor': GiTumor,
  'lu/LuLanguages': LuLanguages,
  'md/MdAgriculture': MdAgriculture,
}
