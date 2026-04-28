'use client';

/**
 * Home Page — Portfolio Summary Landing
 *
 * A landing page with:
 *   - 3D hero with name/title and CTAs (aether background is now global)
 *   - Summary preview cards for About, Skills, Projects, Education, and Contact
 *   - Each card links to its dedicated detail page via Next.js routing
 *   - All buttons feature the animated traveling border glow effect
 */

import { useEffect, useRef, use } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

import AnimatedBorderButton from '@/components/ui/animated-border-button';
import WorldClock from '@/components/world-clock';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ExternalLink,
  Eye,
  Send,
  GraduationCap,
  MapPin,
  Github,
  Linkedin,
  Youtube,
  Facebook,
} from 'lucide-react';

// ─── Brand SVG Icons ────────────────────────────────────────────────────────

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 5.5V18.5C22 19.33 21.33 20 20.5 20H3.5C2.67 20 2 19.33 2 18.5V5.5C2 4.67 2.67 4 3.5 4H20.5C21.33 4 22 4.67 22 5.5ZM20.5 5.5H3.5V7.23L12 12.33L20.5 7.23V5.5ZM3.5 18.5H20.5V9.12L12 14.27L3.5 9.12V18.5Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Tech Stack Icons for Marquee Slider ─────────────────────────────────────

interface TechIconData {
  name: string;
  color: string; // brand color shown on hover
  svg: JSX.Element;
}

const techIcons: TechIconData[] = [
  {
    name: 'Figma',
    color: '#F24E1E',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" /></svg>,
  },
  {
    name: 'React',
    color: '#61DAFB',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" /></svg>,
  },
  {
    name: 'Next.js',
    color: '#FFFFFF',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" /></svg>,
  },
  {
    name: 'TypeScript',
    color: '#3178C6',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" /></svg>,
  },
  {
    name: 'Node.js',
    color: '#339933',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0 l8.795-5.076c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z" /></svg>,
  },
  {
    name: 'Three.js',
    color: '#00e5ff',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Zm-9 12.5-7-4V8l7 4ZM12 11 5 7l7-4 7 4Zm8 5.5-7 4v-8l7-4Z" /></svg>,
  },
  {
    name: 'Tailwind CSS',
    color: '#06B6D4',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" /></svg>,
  },
  {
    name: 'PostgreSQL',
    color: '#4169E1',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698z" /></svg>,
  },
  {
    name: 'Git',
    color: '#F05032',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187" /></svg>,
  },
  {
    name: 'Linux',
    color: '#FCC624',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.585.047 1.042-.245 1.726-.683.637-.358 1.388-.773 2.638-.883.192-.015.372-.027.552-.027.063 0 .122-.006.19-.012l.048-.003c.411-.039.746-.135 1.016-.401.271-.267.403-.647.373-1.085-.027-.397-.17-.749-.404-1.006a.467.467 0 00-.104-.104c.002-.004.004-.008.006-.012.162-.362.186-.719.073-1.044-.232-.674-.912-1.293-1.635-2.003-.364-.358-.767-.733-1.098-1.156-.328-.422-.583-.879-.607-1.397-.004-.069-.005-.136-.005-.202 0-.578.182-1.079.36-1.591.162-.466.314-.954.329-1.523.016-.597-.145-1.192-.479-1.696-.318-.477-.765-.852-1.279-1.109a4.225 4.225 0 00-.871-.318c-.006-.461-.043-.894-.158-1.283-.108-.397-.305-.768-.602-1.038-.296-.268-.674-.423-1.085-.468a3.178 3.178 0 00-.592-.005z" /></svg>,
  },
];

type ProjectAccent = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';

interface FeaturedProject {
  title: string;
  description: string;
  tags: string[];
  accent: ProjectAccent;
  liveUrl: string;
  sourceUrl: string;
  category: string;
  /** Project thumbnail — place images in /public/projects/ */
  image: string;
}

/** Default placeholder image — change per project as needed */
const DEFAULT_PROJECT_IMAGE = '/projects/saas-marketing-website.png';

const featuredProjects: FeaturedProject[] = [
  {
    title: 'SaaS Marketing Website',
    description: 'A modern SaaS marketing website with clean layout, responsive design, and conversion-optimized sections built in Figma',
    tags: ['Figma', 'React', 'Storybook'],
    accent: 'cyan',
    liveUrl: 'https://www.figma.com/proto/nlwcSpHeYKiwCQUzfo9Wcj/SaaS-Marketing-Website?node-id=0-1&t=DLeOgzGDXqUjZUNZ-1',
    sourceUrl: '#',
    category: 'UI/UX',
    image: '/projects/saas-marketing-website.png',
  },
  {
    title: 'Alchemist.io — Portfolio',
    description: 'A cinematic portfolio website with 3D particle physics, glassmorphism UI, and gravity-manipulation interaction built with Next.js and Three.js',
    tags: ['Next.js', 'Three.js', 'TypeScript'],
    accent: 'purple',
    liveUrl: 'https://alchemist-io.vercel.app/',
    sourceUrl: '#',
    category: 'Web Development',
    image: '/projects/alchemist-io.png',
  },
  {
    title: 'AI Content Studio',
    description: 'AI-powered content creation platform with real-time collaboration and intelligent suggestions',
    tags: ['TypeScript', 'OpenAI', 'WebSocket'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'Web Development',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Healthcare App Redesign',
    description: 'Complete UX overhaul of a patient management system, significantly improving task completion rates',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'emerald',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'Fintech Mobile App',
    description: 'Mobile banking app redesign with intuitive navigation, biometric auth, and real-time transaction tracking',
    tags: ['Figma', 'React', 'User Research'],
    accent: 'rose',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
  {
    title: 'EdTech Learning Portal',
    description: 'Interactive e-learning platform with adaptive quizzes, progress dashboards, and gamified achievements',
    tags: ['Figma', 'React', 'Storybook'],
    accent: 'purple',
    liveUrl: '#',
    sourceUrl: '#',
    category: 'UI/UX',
    image: DEFAULT_PROJECT_IMAGE,
  },
];

/** Gradient backgrounds for project image placeholders */
const imageGradientMap: Record<ProjectAccent, string> = {
  cyan: 'from-cyan-900/80 via-cyan-800/60 to-teal-900/80',
  purple: 'from-purple-900/80 via-purple-800/60 to-indigo-900/80',
  emerald: 'from-emerald-900/80 via-emerald-800/60 to-green-900/80',
  amber: 'from-amber-900/80 via-amber-800/60 to-orange-900/80',
  rose: 'from-rose-900/80 via-rose-800/60 to-red-900/80',
};

/** Glow effect on hover */
const glowMap: Record<ProjectAccent, string> = {
  cyan: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
  purple: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
  emerald: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
  amber: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
  rose: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
};

/** Colored tech badges */
const tagColorMap: Record<string, { bg: string; text: string }> = {
  'React': { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  'Three.js': { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  'D3.js': { bg: 'bg-orange-500/20', text: 'text-orange-300' },
  'Next.js': { bg: 'bg-slate-500/20', text: 'text-slate-300' },
  'Node.js': { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  'MongoDB': { bg: 'bg-teal-500/20', text: 'text-teal-300' },
  'TypeScript': { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  'OpenAI': { bg: 'bg-green-500/20', text: 'text-green-300' },
  'WebSocket': { bg: 'bg-teal-500/20', text: 'text-teal-300' },
  'Figma': { bg: 'bg-rose-500/20', text: 'text-rose-300' },
  'Storybook': { bg: 'bg-orange-500/20', text: 'text-orange-300' },
  'User Research': { bg: 'bg-amber-500/20', text: 'text-amber-300' },
  'Prisma': { bg: 'bg-teal-500/20', text: 'text-teal-300' },
};

const defaultTagColor = { bg: 'bg-white/10', text: 'text-white/70' };

// ─── Component ──────────────────────────────────────────────────────────────

export default function Home({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string | string[]>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Next.js 16 requires unwrapping Promise-based props with React.use()
  use(params);
  use(searchParams);

  const cardsRef = useRef<HTMLDivElement>(null);

  // Entrance animation for summary cards
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const items = cards.querySelectorAll('.summary-card');
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Full viewport (aether particles flow behind via global canvas)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Content overlay — pt-20 ensures profile image clears the fixed navbar */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-20 text-center w-full">
          {/* Hero top row: Profile + Clock side by side on lg */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-4xl mb-8">
            {/* Profile Image */}
            <div className="relative flex items-center justify-center">
              <div className="h-64 w-64 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_60px_rgba(0,212,255,0.25)]">
                <Image
                  src="/profile.jpeg"
                  alt="Alex Chen — UI/UX Designer & Front-End Developer"
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/10 scale-110" />
            </div>

            {/* World Clock */}
            <div className="w-full max-w-xs">
              <WorldClock />
            </div>
          </div>

          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-cyan-400 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            UI/UX Designer &amp; Front-End Developer
          </span>

          <h1 className="mb-8 text-h1 bg-gradient-to-r from-primary via-purple-500 to-teal-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Crafting Digital
            <br />
            Experiences
          </h1>

          <p className="mb-12 max-w-2xl text-body text-white/60">
            I design and build beautiful, performant web experiences that delight
            users and drive results. Specializing in interactive interfaces and
            immersive 3D web.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <AnimatedBorderButton href="/projects" variant="primary" size="lg">
              View My Work
            </AnimatedBorderButton>
            <AnimatedBorderButton href="/contact" variant="outline" size="lg">
              Get In Touch
            </AnimatedBorderButton>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SUMMARY CARDS — Brief previews linking to detail pages
          ═══════════════════════════════════════════════════════════════════ */}
      {/* ── Tech Stack Marquee — Full viewport width ──────────────────── */}
      <section className="py-10 overflow-x-clip">
        <div className="text-center mb-10 px-4">
          <h2 className="text-h2 text-white mb-2">
            Tech <span className="gradient-text-cyan">Stack</span>
          </h2>
          <p className="text-white/50 text-sm">Technologies I work with</p>
        </div>
        {/* Marquee container — full viewport width, no padding constraints */}
        <div className="relative overflow-hidden w-[100vw]"
          style={{ marginLeft: 'calc(-50vw + 50%)' }}
        >
          {/* Left gradient fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #050510, transparent)' }} />
          {/* Right gradient fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #050510, transparent)' }} />
          {/* Scrolling track — doubled for seamless loop */}
          <div
            className="flex gap-16 py-4"
            style={{ animation: 'scroll 22s linear infinite' }}
          >
            {[...techIcons, ...techIcons].map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="group/tech flex flex-col items-center gap-3 flex-shrink-0 cursor-default"
              >
                <div
                  className="tech-icon [&>svg]:h-12 [&>svg]:w-12 transition-all duration-300"
                  style={{ '--brand-color': tech.color } as React.CSSProperties}
                >
                  {tech.svg}
                </div>
                <span className="text-xs font-medium text-white/50 group-hover/tech:text-white transition-colors duration-300 whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div ref={cardsRef} className="mx-auto max-w-7xl space-y-8">

          {/* Spacer between marquee and About Me */}
          <div className="h-4" />

          {/* About Summary */}
          <div className="summary-card rounded-2xl border border-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden border border-cyan-400/15">
                  <Image
                    src="/profile.jpeg"
                    alt="Alex Chen"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-h2 text-white">About Me</h2>
                  <p className="mt-4 max-w-xl text-body text-white/60">
                    Senior UI/UX Designer &amp; Front-End Developer with 5+ years of experience
                    crafting digital products. Passionate about design systems, component
                    architecture, and immersive web experiences.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {['5+ Years', '50+ Projects', '30+ Clients'].map((stat) => (
                      <span
                        key={stat}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-cyan-400"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <AnimatedBorderButton href="/about" variant="outline" size="md">
                Read More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </AnimatedBorderButton>
            </div>
          </div>

          {/* Projects Summary — Full project cards matching /projects page */}
          <div className="summary-card">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-h2 text-white">Featured Projects</h2>
                <AnimatedBorderButton href="/projects" variant="outline" size="md">
                  View All
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </AnimatedBorderButton>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <article
                    key={project.title}
                    className={`group/card relative overflow-hidden rounded-2xl border border-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/20 ${glowMap[project.accent]}`}
                  >
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover/card:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Subtle gradient overlay for readability */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${imageGradientMap[project.accent]} opacity-30`} />

                      {/* Category badge */}
                      <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                        {project.category}
                      </span>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover/card:bg-black/20">
                        <span className="text-white/0 transition-all duration-300 group-hover/card:text-white/90 text-sm font-medium backdrop-blur-sm rounded-lg px-4 py-2">
                          Preview
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-h3 text-white">{project.title}</h3>
                      <p className="text-[0.875rem] text-[#94a3b8] leading-relaxed line-clamp-2">{project.description}</p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.tags.map((tag) => {
                          const colors = tagColorMap[tag] || defaultTagColor;
                          return (
                            <span
                              key={tag}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <AnimatedBorderButton
                          href={project.liveUrl}
                          variant="primary"
                          size="sm"
                          borderRadius={6}
                          animationDuration={4}
                          wrapperClassName="flex-1"
                          fullWidth
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </AnimatedBorderButton>

                        <AnimatedBorderButton
                          href={project.sourceUrl}
                          variant="outline"
                          size="sm"
                          borderRadius={6}
                          animationDuration={5}
                          wrapperClassName="flex-1"
                          fullWidth
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </AnimatedBorderButton>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Education Summary */}
          <div className="summary-card rounded-2xl border border-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/8 text-cyan-400">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-h2 text-white">Education</h2>
                  <p className="mt-4 max-w-xl text-body text-white/60">
                    B.Sc. CSE from United International University. Continuously learning through
                    certifications and advanced courses in React, TypeScript, and UI/UX design.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {['B.Sc. CSE', '6 Certifications', '12+ Courses', 'GPA 5.00/5.00 (HSC)'].map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-cyan-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <AnimatedBorderButton href="/education" variant="outline" size="md">
                View Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </AnimatedBorderButton>
            </div>
          </div>

          {/* Connect Section — Rotating border card with socials */}
          <div className="summary-card">
            <div className="text-center mb-8">
              <h2 className="text-h2 text-white mb-4">
                Let&apos;s <span className="gradient-text-teal-blue">Connect</span>
              </h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl border border-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_0_30px_-5px_rgba(0,229,255,0.1)] overflow-hidden">
                <div className="p-8 sm:p-10 text-center">
                  <div className="relative z-10">
                    <h3 className="text-h3 text-white mb-4">
                      Let&apos;s work together
                    </h3>
                    <p className="text-body text-[#94a3b8] mb-8 max-w-md mx-auto">
                      I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center flex-wrap gap-4 mb-8">
                      {[
                        { Icon: GmailIcon, href: 'mailto:alex@portfolio.dev', label: 'Gmail' },
                        { Icon: WhatsAppIcon, href: 'https://wa.me/8801XXXXXXXXX', label: 'WhatsApp' },
                        { Icon: TwitterIcon, href: 'https://x.com/yourhandle', label: 'Twitter' },
                        { Icon: Github, href: 'https://github.com/Ashik1814', label: 'GitHub' },
                        { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                        { Icon: Youtube, href: 'https://youtube.com/@arckbreaker1814?si=iSdffxmKQl47TeMk', label: 'YouTube' },
                        { Icon: Facebook, href: 'https://www.facebook.com/share/18FuK1HEes/', label: 'Facebook' },
                      ].map(({ Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="w-12 h-12 rounded-xl border border-[#1e3a5f]/50 flex items-center justify-center text-[#64748b] hover:text-[#00e5ff] hover:border-[#00e5ff]/30 hover:bg-[#00e5ff]/5 transition-all duration-200"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <AnimatedBorderButton href="/contact" variant="primary" size="lg">
                      Get In Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </AnimatedBorderButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
