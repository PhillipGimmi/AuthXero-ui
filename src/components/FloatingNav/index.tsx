'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useScroll } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <motion.div
    className="relative w-6 h-6"
    initial={false}
  >
    <motion.span
      animate={{
        rotate: isOpen ? 45 : 0,
        y: isOpen ? 8 : 0,
      }}
      transition={{ duration: 0.2 }}
      className="absolute top-0 left-0 w-6 h-0.5 bg-neutral-50 transform origin-center"
    />
    <motion.span
      animate={{
        opacity: isOpen ? 0 : 1,
        x: isOpen ? 8 : 0,
      }}
      transition={{ duration: 0.2 }}
      className="absolute top-[11px] left-0 w-6 h-0.5 bg-neutral-50"
    />
    <motion.span
      animate={{
        rotate: isOpen ? -45 : 0,
        y: isOpen ? -8 : 0,
      }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-0 left-0 w-6 h-0.5 bg-neutral-50 transform origin-center"
    />
  </motion.div>
);

const NavLink = ({ href, children, onClick }: { href: string; children: string; onClick?: () => void }) => {
  return (
    <Link href={href} className="block overflow-hidden" onClick={onClick}>
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-[20px]"
      >
        <span className="flex h-[20px] items-center text-neutral-500 text-sm">
          {children}
        </span>
        <span className="flex h-[20px] items-center text-neutral-50 text-sm drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {children}
        </span>
      </motion.div>
    </Link>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, logout } = useAuth();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-lg z-40"
    >
      <motion.div
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: isOpen ? 0 : -32, opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="flex flex-col items-center justify-center h-full gap-8"
      >
        <NavLink href="/" onClick={onClose}>Home</NavLink>
        <NavLink href="/about" onClick={onClose}>About</NavLink>
        <NavLink href="/pricing" onClick={onClose}>Pricing</NavLink>
        {user ? (
          <motion.button
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-8 py-2 rounded-lg text-neutral-50 border border-neutral-700 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign out
          </motion.button>
        ) : (
          <Link href="/signin" onClick={onClose}>
            <motion.button
              className="px-8 py-2 rounded-lg text-neutral-50 border border-neutral-700 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
};

const FloatingNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const isAuthPage = pathname?.includes('signin');

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothScrollVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 300,
        mass: 0.5
    });
    
    const navbarPosition = useMotionValue(0);
    const springNavPosition = useSpring(navbarPosition, {
        damping: 15,
        stiffness: 150,
        mass: 0.5,
        restDelta: 0.001
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const updateHasScrolled = () => {
            setHasScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', updateHasScrolled);
        return () => window.removeEventListener('scroll', updateHasScrolled);
    }, []);

    useEffect(() => {
        if (isMobile) return;
        
        const unsubscribeFromVelocity = smoothScrollVelocity.on("change", (latestVelocity) => {
            const clampedVelocity = Math.max(-1000, Math.min(1000, latestVelocity));
            navbarPosition.set(clampedVelocity * 0.025);
            
            if (Math.abs(latestVelocity) < 1) {
                navbarPosition.set(0);
            }
        });
        
        return unsubscribeFromVelocity;
    }, [smoothScrollVelocity, navbarPosition, isMobile]);

    return (
        <>
            {isMobile ? (
                <>
                    <div className="h-[52px]" />
                    <header className="fixed top-0 left-0 right-0 z-50">
                        <nav className="w-full bg-black/80 backdrop-blur-lg border-b border-neutral-50/5">
                            <div className="flex items-center justify-between px-4 py-3">
                                <Link href="/" className="flex items-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <svg
                                            width="24"
                                            height="auto"
                                            viewBox="0 0 50 39"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="fill-neutral-50"
                                        >
                                            <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
                                            <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
                                        </svg>
                                    </motion.div>
                                </Link>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2"
                                >
                                    <MenuIcon isOpen={isMenuOpen} />
                                </motion.button>
                            </div>
                        </nav>
                    </header>
                </>
            ) : (
                <motion.div 
                    className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none"
                    style={{ y: hasScrolled ? springNavPosition : 0 }}
                >
                    <motion.div
                        className="w-full flex justify-center"
                        animate={{
                            width: hasScrolled ? '420px' : '100%'
                        }}
                        transition={{
                            width: {
                                duration: 0.3,
                                ease: [0.32, 0.72, 0, 1]
                            }
                        }}
                    >
                        <motion.nav
                            className="flex w-full items-center justify-between pointer-events-auto"
                            initial={false}
                            animate={{
                                y: hasScrolled ? 24 : 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                borderBottom: hasScrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                                border: hasScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                borderRadius: hasScrolled ? '0.75rem' : '0',
                                padding: hasScrolled ? '0.75rem' : '0.5rem 1.5rem',
                            }}
                            transition={{
                                duration: 0.2,
                                ease: [0.32, 0.72, 0, 1]
                            }}
                        >
                            <Link href="/" className={`flex items-center ${hasScrolled ? 'mr-6' : ''}`}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <svg
                                        width="24"
                                        height="auto"
                                        viewBox="0 0 50 39"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="fill-neutral-50"
                                    >
                                        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
                                        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
                                    </svg>
                                </motion.div>
                            </Link>

                            <div className="flex items-center gap-6">
                                <NavLink href="/">Home</NavLink>
                                <NavLink href="/about">About</NavLink>
                                <NavLink href="/pricing">Pricing</NavLink>
                                
                                {!isAuthPage && (
                                    user ? (
                                        <motion.button
                                            onClick={() => logout()}
                                            className="relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] border-neutral-700 px-4 py-1.5 font-medium text-neutral-300 transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-neutral-50 before:transition-transform before:duration-1000 before:content-[''] hover:scale-105 hover:border-neutral-50 hover:text-neutral-900 hover:before:translate-y-[0%] active:scale-100"
                                        >
                                            Sign out
                                        </motion.button>
                                    ) : (
                                        <Link href="/signin">
                                            <motion.button
                                                className="relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] border-neutral-700 px-4 py-1.5 font-medium text-neutral-300 transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-neutral-50 before:transition-transform before:duration-1000 before:content-[''] hover:scale-105 hover:border-neutral-50 hover:text-neutral-900 hover:before:translate-y-[0%] active:scale-100"
                                            >
                                                Sign in
                                            </motion.button>
                                        </Link>
                                    )
                                )}
                            </div>
                        </motion.nav>
                    </motion.div>
                </motion.div>
            )}

            <MobileMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
            />
        </>
    );
};

export default FloatingNav;