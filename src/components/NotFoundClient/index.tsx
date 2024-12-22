'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';

export default function NotFoundClient() {
  return (
    <motion.div
      className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--Colour-Green-Green-25,#00BB7B)] px-4 pt-[80px] md:flex-row md:px-8 md:pt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Section: Text and Button */}
      <motion.div
        className="mb-8 flex max-w-full flex-col items-center text-center md:mb-0 md:max-w-[600px] md:items-start md:text-left"
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
      >
        <motion.h1
          className="mb-4 font-poppins text-[40px] font-semibold leading-tight text-[var(--Colour-Base-White,#FFF)] md:text-[87px] md:leading-[104.4px]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Ooops...
        </motion.h1>
        <motion.h2
          className="mb-4 font-poppins text-[20px] font-medium leading-[1.2] text-[var(--Colour-Base-White,#FFF)] md:text-[30px]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Page Not Found
        </motion.h2>
        <motion.p
          className="mb-8 font-poppins text-[16px] font-normal leading-[1.4] text-[var(--Colour-Base-White,#FFF)] md:text-[20px]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Sorry. The content you&apos;re looking for doesn&apos;t exist. Either
          it was removed, or you mistyped the link.
        </motion.p>
        <Link href="/" passHref>
          <motion.div
            className="flex h-[50px] items-center justify-center rounded-[16px] bg-[var(--Colour-Dark-Green-Dark-Green-100,#01292B)] px-2 font-poppins text-[16px] font-medium leading-[1.4] text-[var(--Colour-Base-White,#FFF)] transition-transform duration-300 md:h-[76px] md:w-[232px] md:text-[20px] cursor-pointer"
            initial={{ scale: 1 }}
            whileHover={{
              scale: 1.05,
              x: 5,
            }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back Home
            <FiArrowUpRight className="ml-2 h-4 w-4 md:h-6 md:w-6" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Center Section: 404.svg */}
      <motion.div
        className="mt-6 max-w-[90%] flex-shrink-0 md:mt-0 md:max-w-[576px]"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Image
          src="/404.svg"
          alt="404 Illustration"
          width={576}
          height={576}
          className="max-h-full max-w-full"
          priority
        />
      </motion.div>

      {/* Right Section: Vertical 404 Text */}
      <motion.div
        className="hidden flex-col items-center font-bebas-neue text-[128px] leading-none text-[var(--Colour-Base-White,#FFF)] md:flex md:text-[256px]"
        style={{ flexShrink: 0 }}
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 0.7 }}
      >
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </motion.div>
    </motion.div>
  );
}
